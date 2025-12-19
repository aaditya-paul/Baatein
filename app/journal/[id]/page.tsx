import { createClient } from "@/lib/supabase/server";
import { NewEntry } from "@/components/features/journal/NewEntry";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JournalEntryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Create client-friendly key for "entries" not "public.entries"
  // Using single() to get one object
  const { data: entry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !entry) {
    redirect("/journal");
  }

  return <NewEntry initialData={entry} />;
}
