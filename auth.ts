import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { isGoogleConfigured } from "@/lib/google";
import { upsertGoogleUser, verifyCredentials } from "@/lib/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    ...(isGoogleConfigured() ? [Google] : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials.email ?? "").trim();
        const password = String(credentials.password ?? "");
        if (!email || !password) return null;
        return verifyCredentials(email, password);
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;
      try {
        const saved = await upsertGoogleUser({
          email: user.email,
          name: user.name,
          image: user.image,
          googleId: account.providerAccountId,
        });
        user.id = saved.id;
      } catch (error) {
        console.error("google sign-in persist failed", error);
        user.id = account.providerAccountId;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* ignore invalid redirect */
      }
      return `${baseUrl}/dashboard`;
    },
  },
});
