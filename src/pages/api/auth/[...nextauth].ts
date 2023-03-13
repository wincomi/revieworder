import NextAuth, { AuthOptions } from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "../../../utils/prismadb"

const APPLE_ID = process.env.NEXTAUTH_APPLE_ID!
const APPLE_SECRET = process.env.NEXTAUTH_APPLE_SECRET!

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        AppleProvider({
            clientId: APPLE_ID,
            clientSecret: APPLE_SECRET
        })
    ]
}

export default NextAuth(authOptions)