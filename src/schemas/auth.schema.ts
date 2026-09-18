import { z } from "zod";

// this schema is getting from client inside req.body of register api.
export const RegisterUserSchema = z
  .object({
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
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;
