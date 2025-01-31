import z from "zod";

export const signupSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email address")
})

export const loginSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email address")
})


export type TloginSchema = z.infer<typeof loginSchema>
export type TsignupSchema = z.infer<typeof signupSchema>

