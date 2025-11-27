import { z } from "zod";

// Admin login validation
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Admin registration validation (for manual creation via Postman)
export const adminRegisterSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name is too long"),
});

export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;

// Change password validation
export const changePasswordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirm_password: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Update admin profile validation
export const updateAdminProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name is too long")
    .optional(),
  email: z
    .string()
    .email("Invalid email format")
    .optional(),
});

export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>;

// User CRUD validation
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required").max(20),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(255).optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().min(1, "Phone is required").max(20).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Order update validation
export const updateOrderSchema = z.object({
  payment_status: z.enum(["pending", "paid", "failed", "cancelled", "refunded"]).optional(),
  payment_method: z.string().max(50).optional(),
  payment_id: z.string().max(255).optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// Order filter validation
export const orderFilterSchema = z.object({
  status: z.enum(["pending", "paid", "failed", "cancelled", "refunded"]).optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  search: z.string().max(255).optional(),
}).merge(paginationSchema);

export type OrderFilterInput = z.infer<typeof orderFilterSchema>;

