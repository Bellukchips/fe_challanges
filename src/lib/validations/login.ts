import z from "zod";

export const loginValidationSchema = z.object({
    email: z.string(),
    password: z.string().min(4),
});