import NextAuth, { AuthOptions } from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import FacebookProvider from 'next-auth/providers/facebook'
import InstagramProvider from 'next-auth/providers/instagram'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "@/libs/prismadb"

const APPLE_ID = process.env.NEXTAUTH_APPLE_ID!
const APPLE_SECRET = process.env.NEXTAUTH_APPLE_SECRET!

const KAKAO_ID = process.env.NEXTAUTH_KAKAO_ID!
const KAKAO_SECRET = process.env.NEXTAUTH_KAKAO_SECRET!

const NAVER_ID = process.env.NEXTAUTH_NAVER_ID!
const NAVER_SECRET = process.env.NEXTAUTH_NAVER_SECRET!

const FACEBOOK_CLIENT_ID = process.env.NEXTAUTH_FACEBOOK_ID!
const FACEBOOK_CLIENT_SECRET = process.env.NEXTAUTH_FACEBOOK_SECRET!

const INSTAGRAM_CLIENT_ID = process.env.NEXTAUTH_INSTAGRAM_ID!
const INSTAGRAM_CLIENT_SECRET = process.env.NEXTAUTH_INSTAGRAM_SECRET!

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
        FacebookProvider({
          clientId: FACEBOOK_CLIENT_ID,
          clientSecret: FACEBOOK_CLIENT_SECRET
        }),
        InstagramProvider({
          clientId: INSTAGRAM_CLIENT_ID,
          clientSecret: INSTAGRAM_CLIENT_SECRET
        }),
    ],
    pages: {
      signIn: '/login'
    },
    callbacks: {
      // https://next-auth.js.org/configuration/callbacks#session-callback
      session: async ({ session, token, user }) => {
        if (session?.user) {
          session.user.id = user.id
        }
        return session
      },
    },
    // Apple 로그인 사용시 'PKCE code_verifier cookie was missing.' 에러 수정
    // 참고 사이트:
    // https://github.com/nextauthjs/next-auth/discussions/6898
    // https://next-auth.js.org/configuration/options#cookies
    cookies: {
      pkceCodeVerifier: {
        name: "next-auth.pkce.code_verifier",
        options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true,
        },
      },
    },
}

export default NextAuth(authOptions)
