import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_ANON_KEY ?? "",
  process.env.SUPABASE_SECRET ?? ""
);

export const saveQuestion = async (message: string) => {
  const { error } = await supabase
    .from("questions")
    .insert({ message: message });

  return error;
};
