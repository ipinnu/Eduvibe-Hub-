import "server-only";

import { createClient } from "@/lib/supabase/server";
import { FEATURED_PRODUCT, type StoreProduct } from "@/lib/store";

export async function getPublishedProducts(): Promise<StoreProduct[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("store_products")
      .select(
        "id,slug,title,short_description,description,product_type,price_kobo,currency,image_url,checkout_url,audience,features,status,featured",
      )
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error || !data?.length) return [FEATURED_PRODUCT];
    return data as StoreProduct[];
  } catch {
    return [FEATURED_PRODUCT];
  }
}
