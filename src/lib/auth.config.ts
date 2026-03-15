import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { rateLimit, RATE_LIMITS } from "./rate-limit";

const ALLOWED_EMAIL_DOMAIN = "aebhukuk.com";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase().trim();

        // Domain kısıtlaması: sadece @aebhukuk.com uzantılı mailler girebilir
        if (!email.endsWith(`@${ALLOWED_EMAIL_DOMAIN}`)) return null;

        // Brute force koruması: IP yerine email bazlı (credentials'tan IP alınamaz)
        const rl = rateLimit(`auth-login:${email}`, RATE_LIMITS.auth);
        if (!rl.success) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/giris",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 8 * 60 * 60, // 8 saat
  },
  trustHost: true,
};
