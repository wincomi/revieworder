import NextAuth, { AuthOptions } from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import KakaoProvider from 'next-auth/providers/kakao'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "../../../utils/prismadb"

const APPLE_ID = process.env.NEXTAUTH_APPLE_ID!
const APPLE_SECRET = process.env.NEXTAUTH_APPLE_SECRET!

const KAKAO_ID = process.env.NEXTAUTH_KAKAO_ID!
const KAKAO_SECRET = process.env.NEXTAUTH_KAKAO_SECRET!

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        AppleProvider({
            clientId: APPLE_ID,
            clientSecret: APPLE_SECRET
        }),
        KakaoProvider({
            clientId: KAKAO_ID,
            clientSecret: KAKAO_SECRET
        }),
    ]
}

export default NextAuth(authOptions)
