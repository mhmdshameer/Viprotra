import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";

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

            return user;
        } catch (error) {
            console.error("Auth error:", error);
            return null;
        }
      },
    }),
  ],
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
