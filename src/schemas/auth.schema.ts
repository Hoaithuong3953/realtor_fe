import { z } from 'zod'

export const emailSchema = z
    .string()
    .min(1, { message: 'login.validation.email_required' })
    .email({ message: 'login.validation.email_invalid' })

export const passwordSchema = z
    .string()
    .min(1, {message: 'login.validation.password_required'})
    .min(8, {message: 'login.validation.password_min'})

// Schema for login form
export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

// Schema for forgot password form
export const forgotPasswordSchema = z.object({
    email: emailSchema,
})

// Schema for reset password form
export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: "login.validation.password_required" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "login.validation.passwords_must_match",
    path: ["confirmPassword"],
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>