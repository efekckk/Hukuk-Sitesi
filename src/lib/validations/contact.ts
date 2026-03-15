import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır").max(100),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().max(20).regex(/^[+\d\s\-()\u0030-\u0039]*$/).optional().or(z.literal("")),
  subject: z.string().min(3, "Konu en az 3 karakter olmalıdır").max(200),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır").max(5000),
  kvkkConsent: z.literal(true, { message: "KVKK onayı gereklidir" }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
