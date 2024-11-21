import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_ANON_KEY ?? ""
);

export const saveQuestion = async (message: string) => {
  const { error } = await supabase
    .from("questions")
    .insert({ message: message });

  return error;
};
