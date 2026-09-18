import { z } from "zod";

export const CreatePostSchema = z.object({
  // user_id: z.number().int().positive("user_id must be a positive number"),
  title: z.string().min(1, "title is required").max(200, "title too long"),
  content: z.string().optional(),
});

export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = z
  .object({
    title: z.string().min(1, "title is required").max(200, "title too long").optional(),
    content: z.string().optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field (title or content) must be provided",
  });

export type UpdatePostSchemaType = z.infer<typeof UpdatePostSchema>;