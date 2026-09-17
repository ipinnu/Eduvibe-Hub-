import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatPrice } from "@/lib/store";
import { getPublishedProducts } from "@/lib/store-server";

export async function Store() {
  const products = await getPublishedProducts();
  const [featured, ...moreProducts] = products;

  return (
    <section className="min-h-screen bg-ev-cream pb-24 pt-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <RevealOnScroll>
          <div className="grid items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-28 w-28 rounded-full bg-ev-yellow-lt" />
              <div className="relative overflow-hidden rounded-[28px] border-2 border-ev-green bg-white p-3 shadow-[10px_10px_0_#111A4A]">
                <Image
                  src={featured.image_url}
                  alt={featured.title}
                  width={1000}
                  height={1000}
                  priority
                  className="aspect-square w-full rounded-[18px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-3 rotate-2 rounded-xl border-2 border-ev-green bg-ev-yellow px-5 py-3 font-mono text-label-sm font-bold uppercase text-ev-green shadow-[4px_4px_0_#111A4A]">
                Learn · practise · grow
              </div>
            </div>

            <div className="pt-2 lg:pt-8">
              <SectionLabel>{featured.product_type}</SectionLabel>
              <h1 className="mt-5 max-w-[720px] font-display text-display-lg text-ev-ink lg:text-[52px] lg:leading-[1.05]">
                {featured.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-body-sm text-ev-muted">
                <span className="font-bold text-ev-green">By EduVibe Hub</span>
                <span aria-hidden="true">•</span>
                <span>Instant PDF download</span>
                <span aria-hidden="true">•</span>
                <span>Created for real learning</span>
              </div>

              <div className="mt-8 border-y border-ev-line py-6">
                <p className="font-display text-[38px] leading-none text-ev-green">
                  {formatPrice(featured.price_kobo, featured.currency)}
                </p>
                <p className="mt-2 text-body-sm text-ev-muted">One-time payment · Keep it forever</p>
              </div>

              <p className="mt-7 max-w-[650px] text-body-lg text-ev-muted">
                {featured.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={featured.checkout_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-ev-green bg-ev-yellow px-8 text-[14px] font-extrabold text-ev-green shadow-[4px_4px_0_#111A4A] transition hover:-translate-y-1"
                >
                  Buy workbook now <span className="ml-3" aria-hidden="true">↗</span>
                </Link>
                <a
                  href="#inside"
                  className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-ev-green bg-white px-8 text-[14px] font-extrabold text-ev-green transition hover:bg-ev-blue-lt"
                >
                  See what&apos;s inside
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <div id="inside" className="mt-28 grid gap-6 lg:grid-cols-[1fr_0.7fr]">
          <RevealOnScroll>
            <article className="h-full rounded-[28px] border border-ev-line bg-white p-7 sm:p-10">
              <SectionLabel>Inside the workbook</SectionLabel>
              <h2 className="mt-4 font-display text-display-md text-ev-ink">
                Everything needed to make place value click.
              </h2>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {featured.features.map((feature, index) => (
                  <div key={feature} className="flex gap-3 rounded-xl bg-ev-board p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ev-yellow font-mono text-[10px] font-bold text-ev-green">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body-sm font-semibold text-ev-ink">{feature}</span>
                  </div>
                ))}
              </div>
            </article>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <aside className="h-full rounded-[28px] bg-ev-green p-7 text-white sm:p-10">
              <p className="font-mono text-label-sm uppercase text-ev-yellow">Who it&apos;s for</p>
              <h2 className="mt-4 font-display text-[32px] leading-tight">Built for the grown-up helping a child learn.</h2>
              <p className="mt-5 text-body-md text-white/75">{featured.audience}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {["Parents", "Tutors", "Teachers", "Year 6"].map((label) => (
                  <span key={label} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-bold">
                    {label}
                  </span>
                ))}
              </div>
            </aside>
          </RevealOnScroll>
        </div>

        {moreProducts.length ? (
          <div className="mt-20">
            <h2 className="font-display text-display-md">More from EduVibe</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {moreProducts.map((product) => (
                <article key={product.id} className="rounded-2xl border border-ev-line bg-white p-5">
                  <Image src={product.image_url} alt={product.title} width={500} height={500} className="aspect-square rounded-xl object-cover" />
                  <p className="mt-5 font-mono text-label-sm uppercase text-ev-green-mid">{product.product_type}</p>
                  <h3 className="mt-2 font-bold text-ev-ink">{product.title}</h3>
                  <p className="mt-3 font-display text-2xl">{formatPrice(product.price_kobo, product.currency)}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
