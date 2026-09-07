import { z } from "zod";
export const CreatePostSchema = z.object({
  user_id: z.number().int().positive("user_id must be a positive number"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().optional(),
});

export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>
