"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEntry(formData: FormData) {
  const content = formData.get("content") as string;
  if (!content || content.trim() === "") {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase.from("entries").insert({
    user_id: user.id,
    content: content,
  });

  if (error) {
    console.error("Error creating entry:", error);
    throw new Error("Failed to create entry");
  }

  revalidatePath("/journal");
  redirect("/journal");
}
