type SupabaseErrorLike = {
  code?: string;
  message?: string;
};

export function isMissingSchemaTableError(error: unknown) {
  const supabaseError = error as SupabaseErrorLike | null;
  const message = supabaseError?.message ?? "";

  return (
    supabaseError?.code === "PGRST205" ||
    message.includes("Could not find the table") ||
    message.includes("schema cache")
  );
}
