import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.email("Invalid email format"),
  age: z
    .number()
    .int("Age must be an integer")
    .positive("Age must be positive")
    .max(150, "Age seems invalid"),
  is_active: z.boolean().optional(),
  bio: z.string().optional(),
  balance: z.number().nonnegative("Balance cannot be negative").optional(),
  preferences: z.record(z.string(), z.any()).optional(),
});

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;

// User Id Param schema: 'id' in params must be a positive integer.
export const UserIdParamSchema = z.object({
  id: z.coerce.number().int().positive("id must be a positive integer"),
});
export type UserIdParamSchemaType = z.infer<typeof UserIdParamSchema>;
