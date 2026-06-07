import { createClient } from "@/lib/supabase/server";
import { ExhibitClient } from "@/components/exhibit-client";

export default async function ExhibitPage() {
  const supabase = await createClient();
  const { data: tshirts } = await supabase
    .from("tshirts")
    .select("id,title,series,image_url")
    .order("created_at", { ascending: false });

  return <ExhibitClient items={tshirts ?? []} />;
}
