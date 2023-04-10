import NextAuth, { AuthOptions } from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import FacebookProvider from 'next-auth/providers/facebook'
import InstagramProvider from 'next-auth/providers/instagram'
import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "@/libs/prismadb"
import { AdapterAccount } from 'next-auth/adapters'
import { regexNumber, regexPhoneNumber } from '@/utils/regex'

const { 
  NEXTAUTH_APPLE_ID: APPLE_ID, 
  NEXTAUTH_APPLE_SECRET: APPLE_SECRET,

  NEXTAUTH_KAKAO_ID: KAKAO_ID,
  NEXTAUTH_KAKAO_SECRET: KAKAO_SECRET,

  NEXTAUTH_NAVER_ID: NAVER_ID,
  NEXTAUTH_NAVER_SECRET: NAVER_SECRET,

  NEXTAUTH_FACEBOOK_ID: FACEBOOK_ID,
  NEXTAUTH_FACEBOOK_SECRET: FACEBOOK_SECRET,

  NEXTAUTH_INSTAGRAM_ID: INSTAGRAM_ID,
  NEXTAUTH_INSTAGRAM_SECRET: INSTAGRAM_SECRET,
 } = process.env

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

const phoneNumberProvider = CredentialsProvider({
  id: "phonenumber",
  name: "phonenumber", // await signIn("phonenumber", { ... }) 으로 사용 가능
  credentials: {
      phoneNumber: { label: "휴대폰 번호", type: "text", placeholder: "010-0000-0000" },
      verificationCode: { label: "인증 코드", type: "number", placeholder: "123456" }
  },
  authorize: async (credentials, req) => {
    // 휴대폰 번호와 인증 코드가 전달되지 않을 경우 null 반환
    if (credentials?.phoneNumber == null || credentials.verificationCode == null) {
      return null
    }

    const phoneNumber = credentials.phoneNumber.replace(/-/g, "") // 휴대폰 번호 하이픈(-) 제거
    const { verificationCode }  = credentials

    // 휴대폰 번호 유효성 검사
    const isValidPhoneNumber = phoneNumber.match(regexPhoneNumber)

    // 인증 코드 유효성 검사
    const isValidVerificationCode = verificationCode.match(regexNumber)

    if (!(isValidPhoneNumber && isValidVerificationCode)) {
      return null
    }
  
    var user
    
    // 휴대폰 번호와 같은 유저 검색
    // TODO: findUnique로 변경 및 인증 코드(verificationCode) 확인 추가
    user = await prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber
      }
    })

    // 만약 유저가 없을 경우 가입
    user = await prisma.user.create({ 
      data: { phoneNumber: phoneNumber }
    })

    return user
  }
})

export var authOptions: AuthOptions = {
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
          clientId: FACEBOOK_ID,
          clientSecret: FACEBOOK_SECRET
        }),
        InstagramProvider({
          clientId: INSTAGRAM_ID,
          clientSecret: INSTAGRAM_SECRET
        }),
        phoneNumberProvider
    ],
    pages: {
      signIn: '/login'
    },
    callbacks: {
      // https://next-auth.js.org/configuration/callbacks#session-callback
      session: async ({ session, token, user }) => {
        // 데이터베이스(database) 세션일 경우 user가 반환됨
        // JSON Web Token 세션일 경우 user 대신 JWT token이 반환됨

        if (session?.user) {
          // token.sub은 user.id와 동일 (https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/core/routes/callback.ts#L125)
          session.user.id = token.sub!
        }

        return session
      },
      // jwt: async ({ token, user, account, profile, isNewUser }) => {
      //   // user, account, profile, isNewUser는 데이터베이스를 사용할 경우에만 사용됨
      //   return token
      // },
      redirect: async ({ url, baseUrl }) => {
        return baseUrl
      }
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
    session: {
      // CredentialsProvider 사용을 위해 (jwt만 사용 가능) 세션을 database 대신 jwt로 사용함
      // Session 테이블을 사용하지 않음
      strategy: "jwt"
    },
}

// 개발 모드일 경우 디버그 활성화
if (process.env.NODE_ENV !== "production") {
  authOptions.debug = true
}

export default NextAuth(authOptions)
