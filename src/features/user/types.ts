import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;
