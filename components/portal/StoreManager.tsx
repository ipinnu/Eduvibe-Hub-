"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FEATURED_PRODUCT, formatPrice, type StoreProduct } from "@/lib/store";

type SaveState = "idle" | "saving" | "saved" | "error";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    || `resource-${Date.now()}`;
}

function newProduct(): StoreProduct {
  return {
    ...FEATURED_PRODUCT,
    id: crypto.randomUUID(),
    slug: `new-resource-${Date.now()}`,
    title: "New learning resource",
    short_description: "",
    description: "",
    product_type: "Downloadable workbook",
    price_kobo: 0,
    image_url: "/mastering-maths-year-6.png",
    checkout_url: "",
    audience: "",
    features: [],
    status: "draft",
    featured: false,
  };
}

export function StoreManager() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<StoreProduct[]>([FEATURED_PRODUCT]);
  const [selectedSlug, setSelectedSlug] = useState(FEATURED_PRODUCT.slug);
  const [product, setProduct] = useState<StoreProduct>(FEATURED_PRODUCT);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("Loading the live store connection…");

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      const { data, error } = await supabase
        .from("store_products")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (!active) return;
      if (data?.length) {
        const next = data as StoreProduct[];
        setProducts(next);
        setProduct(next[0]);
        setSelectedSlug(next[0].slug);
        setMessage("Connected to the live website store.");
      } else if (error) {
        setMessage("Preview mode — apply the included Supabase migration to publish edits.");
      } else {
        setMessage("Store is connected. Save the first resource to publish it.");
      }
    }
    void loadProducts();
    return () => { active = false; };
  }, [supabase]);

  function selectProduct(next: StoreProduct) {
    setProduct(next);
    setSelectedSlug(next.slug);
    setSaveState("idle");
    setMessage("Editing selected resource.");
  }

  function addProduct() {
    const next = newProduct();
    setProducts((current) => [next, ...current]);
    selectProduct(next);
    setMessage("Draft resource created locally. Fill it in and publish changes.");
  }

  function update<K extends keyof StoreProduct>(key: K, value: StoreProduct[K]) {
    setProduct((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && (!current.slug || current.slug.startsWith("new-resource-"))) {
        next.slug = slugify(String(value));
      }
      setProducts((items) => items.map((item) => item.id === next.id ? next : item));
      setSelectedSlug(next.slug);
      return next;
    });
    setSaveState("idle");
  }

  async function saveProduct() {
    setSaveState("saving");
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setSaveState("error");
      setMessage("Sign in as tutor admin before publishing store changes.");
      return;
    }

    const cleanProduct = {
      ...product,
      slug: slugify(product.slug || product.title),
      features: product.features.map((item) => item.trim()).filter(Boolean),
    };

    const { error } = await supabase.from("store_products").upsert(cleanProduct, { onConflict: "slug" });
    if (error) {
      setSaveState("error");
      setMessage(error.message.includes("schema cache") ? "Apply the Supabase migration first, then save again." : error.message);
      return;
    }

    setProduct(cleanProduct);
    setProducts((items) => {
      const withoutCurrent = items.filter((item) => item.id !== cleanProduct.id && item.slug !== cleanProduct.slug);
      return [cleanProduct, ...withoutCurrent];
    });
    setSelectedSlug(cleanProduct.slug);
    setSaveState("saved");
    setMessage("Published — the public website store now uses this resource.");
  }

  const inputClass = "mt-2 w-full rounded-xl border border-ev-line bg-white px-4 py-3 text-[12px] text-ev-ink outline-none transition focus:border-ev-green focus:ring-2 focus:ring-ev-yellow/40";
  const labelClass = "block text-[10px] font-extrabold uppercase tracking-[0.08em] text-ev-muted";

  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-label-sm uppercase text-ev-green-mid">Resources</p>
          <h1 className="mt-2 font-display text-[40px] leading-tight">Edit the resources families see.</h1>
          <p className="mt-2 text-body-sm text-ev-muted">Add workbooks, exam packs, printables, or support materials. Click a resource card to open its full editable fields.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={addProduct} className="inline-flex min-h-11 items-center rounded-xl border border-ev-line bg-white px-5 text-[11px] font-bold">Add resource</button>
          <Link href="/store" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-ev-line bg-white px-5 text-[11px] font-bold">Preview public store ↗</Link>
          <button type="button" onClick={saveProduct} disabled={saveState === "saving"} className="min-h-11 rounded-xl bg-ev-green px-6 text-[11px] font-extrabold text-white shadow-[4px_4px_0_#FFD21F] disabled:opacity-60">
            {saveState === "saving" ? "Publishing…" : "Publish changes"}
          </button>
        </div>
      </div>

      <div className={`mt-6 rounded-xl border px-4 py-3 text-[11px] font-semibold ${saveState === "error" ? "border-red-200 bg-red-50 text-red-700" : saveState === "saved" ? "border-green-200 bg-green-50 text-green-800" : "border-ev-line bg-white text-ev-muted"}`}>
        {message}
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[0.7fr_1fr_0.72fr]">
        <section className="rounded-[22px] border border-ev-line bg-white p-5 md:p-6">
          <div className="flex items-center justify-between gap-3"><h2 className="text-[13px] font-extrabold">Resource list</h2><span className="rounded-full bg-ev-board px-3 py-1 text-[9px] font-bold">{products.length} total</span></div>
          <div className="mt-4 grid gap-3">
            {products.map((item) => (
              <button key={`${item.id}-${item.slug}`} type="button" onClick={() => selectProduct(item)} className={`rounded-2xl border p-4 text-left transition ${selectedSlug === item.slug ? "border-ev-green bg-ev-yellow-lt/50" : "border-ev-line bg-white hover:border-ev-green/40"}`}>
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-mono text-[8px] font-bold uppercase text-ev-green-mid">{item.product_type || "Resource"}</p>
                    <h3 className="mt-1 text-[12px] font-extrabold leading-snug">{item.title || "Untitled resource"}</h3>
                  </div>
                  <span className={`h-fit rounded-full px-2.5 py-1 text-[8px] font-bold ${item.status === "published" ? "bg-ev-teal-lt text-ev-green" : "bg-ev-board text-ev-muted"}`}>{item.status}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-[10px] leading-5 text-ev-muted">{item.short_description || "No summary yet."}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-ev-line bg-white p-5 md:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>Product title<input className={inputClass} value={product.title} onChange={(event) => update("title", event.target.value)} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Slug<input className={inputClass} value={product.slug} onChange={(event) => update("slug", slugify(event.target.value))} /></label>
            <label className={labelClass}>Product type<input className={inputClass} value={product.product_type} onChange={(event) => update("product_type", event.target.value)} /></label>
            <label className={labelClass}>Price (NGN)<input className={inputClass} type="number" min="0" value={product.price_kobo / 100} onChange={(event) => update("price_kobo", Number(event.target.value) * 100)} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Short promise<input className={inputClass} value={product.short_description} onChange={(event) => update("short_description", event.target.value)} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Full description<textarea className={`${inputClass} min-h-32 resize-y`} value={product.description} onChange={(event) => update("description", event.target.value)} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Who it is for<textarea className={`${inputClass} min-h-24 resize-y`} value={product.audience} onChange={(event) => update("audience", event.target.value)} /></label>
            <label className={`${labelClass} sm:col-span-2`}>What is included <span className="normal-case tracking-normal text-ev-muted/70">(one item per line)</span><textarea className={`${inputClass} min-h-40 resize-y`} value={product.features.join("\n")} onChange={(event) => update("features", event.target.value.split("\n"))} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Checkout link<input className={inputClass} type="url" value={product.checkout_url} onChange={(event) => update("checkout_url", event.target.value)} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Cover image URL or public path<input className={inputClass} value={product.image_url} onChange={(event) => update("image_url", event.target.value)} /></label>
            <label className={labelClass}>Visibility<select className={inputClass} value={product.status} onChange={(event) => update("status", event.target.value as StoreProduct["status"])}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
            <label className="flex items-center gap-3 self-end rounded-xl bg-ev-board px-4 py-3 text-[11px] font-bold"><input type="checkbox" checked={product.featured} onChange={(event) => update("featured", event.target.checked)} className="h-4 w-4 accent-ev-green" /> Feature this product</label>
          </div>
        </section>

        <aside className="sticky top-28 rounded-[22px] border border-ev-line bg-white p-5 md:p-7">
          <div className="flex items-center justify-between"><h2 className="text-[13px] font-extrabold">Live card preview</h2><span className={`rounded-full px-3 py-1 text-[9px] font-bold ${product.status === "published" ? "bg-ev-teal-lt text-ev-green" : "bg-ev-yellow-lt"}`}>{product.status}</span></div>
          <div className="mt-5 overflow-hidden rounded-2xl border-2 border-ev-green bg-ev-cream">
            <div className="relative aspect-square bg-white p-3"><Image src={product.image_url || "/mastering-maths-year-6.png"} alt="Product preview" fill className="object-cover p-3" /></div>
            <div className="p-5">
              <p className="font-mono text-[9px] font-bold uppercase tracking-wide text-ev-green-mid">{product.product_type}</p>
              <h3 className="mt-3 font-display text-[28px] leading-tight">{product.title || "Untitled product"}</h3>
              <p className="mt-3 text-[10px] leading-5 text-ev-muted">{product.short_description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-ev-line pt-4"><span className="font-display text-[26px]">{formatPrice(product.price_kobo, product.currency)}</span><span className="rounded-lg bg-ev-yellow px-4 py-2 text-[10px] font-extrabold">Buy now</span></div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
