import NextAuth, { AuthOptions } from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "@/libs/prismadb"

const APPLE_ID = process.env.NEXTAUTH_APPLE_ID!
const APPLE_SECRET = process.env.NEXTAUTH_APPLE_SECRET!

const KAKAO_ID = process.env.NEXTAUTH_KAKAO_ID!
const KAKAO_SECRET = process.env.NEXTAUTH_KAKAO_SECRET!

const NAVER_ID = process.env.NEXTAUTH_NAVER_ID!
const NAVER_SECRET = process.env.NEXTAUTH_NAVER_SECRET!

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
        NaverProvider({
          clientId: NAVER_ID,
          clientSecret: NAVER_SECRET
      }),
    ],
    callbacks: {
        // https://next-auth.js.org/configuration/callbacks#session-callback
        session: async ({ session, token, user }) => {
          if (session?.user) {
            session.user.id = user.id
          }
          return session
        },
      }  
}

export default NextAuth(authOptions)
