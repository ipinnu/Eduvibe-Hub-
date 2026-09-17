export type StoreProduct = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  product_type: string;
  price_kobo: number;
  currency: string;
  image_url: string;
  checkout_url: string;
  audience: string;
  features: string[];
  status: "draft" | "published" | "archived";
  featured: boolean;
};

export const FEATURED_PRODUCT: StoreProduct = {
  id: "00000000-0000-4000-8000-000000000001",
  slug: "mastering-maths-year-6-numbers-place-value",
  title: "Mastering Maths – Year 6 Numbers & Place Value Workbook",
  short_description:
    "Seven guided lessons, worked examples, focused practice, and a complete answer key.",
  description:
    "A practical 9-page workbook that takes Year 6 learners step by step through reading, writing, comparing, ordering, rounding, and creating numbers. Each lesson builds real understanding with clear objectives and guided practice.",
  product_type: "Downloadable workbook",
  price_kobo: 350000,
  currency: "NGN",
  image_url: "/mastering-maths-year-6.png",
  checkout_url: "https://selar.com/h35458h504",
  audience:
    "Year 6 learners working on place value up to 10 million — ideal for parents, tutors, and teachers.",
  features: [
    "7 complete Numbers & Place Value lessons",
    "Clear learning objectives for every lesson",
    "Worked examples and remember boxes",
    "Real-life word problems",
    "Full answer key included",
    "Print-ready PDF for home or classroom use",
  ],
  status: "published",
  featured: true,
};

export function formatPrice(priceKobo: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(priceKobo / 100);
}
