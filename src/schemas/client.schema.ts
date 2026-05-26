import { z } from "zod"

export const clientSchema = z.object({
  full_name: z.string().min(1, { message: "validation.name_invalid" }),
  phone: z.string().nullable().optional().refine(val => !val || /^0[0-9\s.()-]{9,14}$/.test(val), { message: "validation.phone_invalid" }),
  email: z.string().email({ message: "validation.email_invalid" }).nullable().optional().or(z.literal("")),
  customer_type: z.enum(["buyer", "seller", "renter", "landlord"]).optional(),
  goal_type: z.enum(["buy", "rent", "sell", "lease"]).optional(),
  budget_min: z.number().nullable().optional(),
  budget_max: z.number().nullable().optional(),
  status: z.enum(["new", "contacted", "qualified", "closed", "archived"]).optional(),
  summary: z.string().optional().nullable(),
}).refine(data => {
  if (data.budget_min !== null && data.budget_min !== undefined && 
      data.budget_max !== null && data.budget_max !== undefined) {
    return data.budget_max >= data.budget_min
  }
  return true
}, {
  message: "validation.budget_invalid",
  path: ["budget_max"]
})
