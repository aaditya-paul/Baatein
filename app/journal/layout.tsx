import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EncryptionProvider } from "@/components/features/EncryptionProvider";

export default async function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Mobile-first safe area padding */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 md:max-w-2xl lg:max-w-4xl h-full">
        <EncryptionProvider>{children}</EncryptionProvider>
      </main>
    </div>
  );
}
