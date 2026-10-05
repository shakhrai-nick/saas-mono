import z from "zod";

export const signUpSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(128)
});

export const signInSchema = z.object({
    email: z.email(),
    password: z.string()
})

export const emailSchema = z.object({
    email: z.email()
});

export const resetPasswordSchema = z.object({
    token: z.string(),
    passwordHash: z.string().min(6).max(128)
});

export type SignUpDto = z.infer<typeof signUpSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
export type EmailDto = z.infer<typeof emailSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
