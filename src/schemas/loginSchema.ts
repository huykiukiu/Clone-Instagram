import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .pipe(z.email("Email không đúng định dạng")),

  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
});
