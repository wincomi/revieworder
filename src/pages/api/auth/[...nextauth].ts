import NextAuth, { AuthOptions } from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import FacebookProvider from 'next-auth/providers/facebook'
import InstagramProvider from 'next-auth/providers/instagram'

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "@/libs/prismadb"
import { AdapterAccount } from 'next-auth/adapters'

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

var prismaAdapter = PrismaAdapter(prisma)

prismaAdapter.linkAccount = (account: AdapterAccount) => {
  // 디버그 코드
  // console.log(account)
  // return new Promise<void>(() => { })

  // account를 AdapterAccount 타입에서 Account 테이블에 Create할 수 있는 형식으로 변경
  // 다른 key가 있을 경우 Account 테이블에 컬럼이 없어 데이터를 추가할 수 없어서 오류가 발생함.
  // 예) 카카오 로그인 Callback시 Unknown arg `refresh_token_expires_in` in data.refresh_token_expires_in for type AccountUncheckedCreateInput. 에러 발생
  const newAccount = {
    // 필수
    userId: account.userId, // User 테이블의 id의 외래키. Instagram에서 반환하는 user_id와는 다름
    type: account.type, // "oauth" | "email" | "credentials"
    provider: account.provider,
    providerAccountId: account.providerAccountId,

    // 선택 사항 (SNS API에 따라 없을 수도 있음)
    // TokenSetParameters
    refresh_token: account.refresh_token,
    access_token: account.access_token,
    expires_at: account.expires_at,
    token_type: account.token_type,
    scope: account.scope,
    id_token: account.id_token,
    session_state: account.session_state,  
  }

  return prisma.account.create({ data: newAccount }) as unknown as AdapterAccount
}

export const authOptions: AuthOptions = {
    adapter: prismaAdapter,
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
