import { z } from "zod"
export const userUpdateSchema = z.object({
  full_name: z.string().min(1, { message: "validation.name_invalid" }),
  email: z.string().email({ message: "validation.email_invalid" }),
  phone: z.string().nullable().optional().refine(val => !val || /^0[0-9\s.()-]{9,14}$/.test(val), { message: "validation.phone_invalid" }),
  role_id: z.number().nullable().optional(),
  status: z.enum(["active", "inactive", "locked"]).optional(),
})

export const userCreateSchema = userUpdateSchema.extend({
  password: z.string().min(8, { message: "validation.password_min" }),
})

export const userSchema = userUpdateSchema
