import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
            await connectToMongoDB();
            const user = await User.findOne({ username: credentials.username });

            if(!user) {
                return null;
            }

            const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

            if(!passwordsMatch) {
             return null;
            }

            return {
              id: user._id.toString(),
              username: user.username
            };
        } catch (error) {
            console.error("Auth error:", error);
            return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/sign-in",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
