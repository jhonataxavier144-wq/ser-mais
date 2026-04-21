import { adminDb } from "@/lib/firebase-admin";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // No adapter needed — we manage Firestore users manually via callbacks
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const usersRef = adminDb.collection("users");
        const snapshot = await usersRef.where("email", "==", credentials.email).get();
        
        if (snapshot.empty) {
          throw new Error("Usuário não encontrado");
        }

        const user = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;

        if (!user.password) {
          throw new Error("Conta sem senha configurada");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Senha incorreta");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // When signing in with Google, ensure a Firestore user document exists
      if (account?.provider === "google" && user.email) {
        const usersRef = adminDb.collection("users");
        const snapshot = await usersRef.where("email", "==", user.email).get();

        if (snapshot.empty) {
          // Create new user from Google profile
          const newUserRef = await usersRef.add({
            name: user.name || "",
            email: user.email,
            image: user.image || "",
            role: "USER",
            xp: 0,
            nivel: 1,
            createdAt: new Date().toISOString(),
            provider: "google",
          });
          // Attach Firestore ID to the user object for the JWT callback
          (user as any).id = newUserRef.id;
          (user as any).role = "USER";
        } else {
          // User exists — attach their Firestore data
          const existingUser = snapshot.docs[0];
          (user as any).id = existingUser.id;
          (user as any).role = existingUser.data().role || "USER";

          // Update image if changed
          if (user.image && user.image !== existingUser.data().image) {
            await existingUser.ref.update({ image: user.image });
          }
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id || token.sub;
        token.role = (user as any).role;
      }
      // If role is missing (e.g. after token refresh), fetch from Firestore
      if (!token.role && token.sub) {
        try {
          const userDoc = await adminDb.collection("users").doc(token.sub).get();
          if (userDoc.exists) {
            token.role = userDoc.data()?.role || "USER";
          }
        } catch {
          // Silent fail — role will default
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
