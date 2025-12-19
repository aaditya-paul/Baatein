import { WelcomeScreen } from "@/components/features/WelcomeScreen";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/journal");
  }

  return (
    <div>
      <WelcomeScreen />
    </div>
  );
}

export default Page;
