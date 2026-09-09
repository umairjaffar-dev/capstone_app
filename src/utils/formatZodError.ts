import { ZodError } from "zod";

export function formatZodError(
  error: ZodError,
  data: Record<string, unknown>,
): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "root";
    if (formatted[key]) continue;
    if (issue.code === "invalid_type") {
      const value = data?.[key];
      if (value === undefined) {
        formatted[key] = `${key} is required`;
      } else {
        formatted[key] = `${key} must be a valid ${(issue as any).expected}`;
      }
    } else {
      formatted[key] = issue.message;
    }
  }
  return formatted;
}
