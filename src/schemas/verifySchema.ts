import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().min(6, "code must be atleast 6 digits"),
});
