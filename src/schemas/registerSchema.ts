import * as z from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email không được để trống")
      .pipe(z.email("Email không đúng định dạng")),

    username: z
      .string()
      .min(3, "Username phải có ít nhất 3 ký tự")
      .max(30, "Username không được quá 30 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username chỉ được chứa chữ cái, số và dấu gạch dưới",
      ),

    fullName: z
      .string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được quá 50 ký tự"),

    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
      ),

    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
