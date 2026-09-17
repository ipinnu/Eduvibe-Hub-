import Image from "next/image";
import { PortalShell } from "@/components/portal/PortalShell";
import { requirePortalRole } from "@/lib/auth";
import { formatPrice } from "@/lib/store";
import { getPublishedProducts } from "@/lib/store-server";

export default async function PortalResourcesPage() {
  const user = await requirePortalRole(["tutor_admin", "partner_tutor", "parent", "child"]);
  const products = await getPublishedProducts();

  return (
    <PortalShell role={user.role} userName={user.fullName} userEmail={user.email}>
      <p className="font-mono text-label-sm uppercase text-ev-green-mid">Resources</p>
      <h1 className="mt-3 font-display text-[42px] leading-tight">Learning materials for your family.</h1>
      <p className="mt-3 max-w-2xl text-body-md text-ev-muted">
        Browse EduVibe workbooks and extras without leaving the portal. Checkout opens securely in a new tab.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="flex flex-col overflow-hidden rounded-[22px] border border-ev-line bg-white">
            <div className="relative aspect-square bg-ev-board">
              <Image
                src={product.image_url || "/mastering-maths-year-6.png"}
                alt={product.title}
                fill
                className="object-cover p-3"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="font-mono text-[9px] font-bold uppercase tracking-wide text-ev-green-mid">{product.product_type}</p>
              <h2 className="mt-2 text-[15px] font-extrabold leading-snug text-ev-ink">{product.title}</h2>
              <p className="mt-2 flex-1 text-[11px] leading-5 text-ev-muted">{product.short_description}</p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-ev-line pt-4">
                <span className="font-display text-[24px] text-ev-green">{formatPrice(product.price_kobo, product.currency)}</span>
                <a
                  href={product.checkout_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-ev-yellow px-4 py-2.5 text-[10px] font-extrabold text-ev-green"
                >
                  Buy now ↗
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
