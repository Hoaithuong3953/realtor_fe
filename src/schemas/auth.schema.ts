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

export type LoginFormValues = z.infer<typeof loginSchema>