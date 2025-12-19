import { JournalHome } from "@/components/features/journal";

export default function JournalPage() {
  // TODO: Fetch real entries from Supabase
  const entries: any[] = [];

  return <JournalHome entries={entries} />;
}
