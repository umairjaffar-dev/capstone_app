import { z } from "zod";

// User Id Param schema: 'id' in params must be a positive integer.
export const UserIdParamSchema = z.object({
  id: z.coerce.number().int().positive("id must be a positive integer"),
});
export type UserIdParamSchemaType = z.infer<typeof UserIdParamSchema>;
