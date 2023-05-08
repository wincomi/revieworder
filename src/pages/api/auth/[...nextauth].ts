import NextAuth, { AuthOptions } from "next-auth"
import AppleProvider from "next-auth/providers/apple"
import KakaoProvider from "next-auth/providers/kakao"
import NaverProvider from "next-auth/providers/naver"
import FacebookProvider from "next-auth/providers/facebook"
import InstagramProvider from "next-auth/providers/instagram"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/libs/prismadb"
import PhoneNumberProvider from "@/libs/nextauth/phoneNumberProvider"
import prismaAdapterLinkAccount from "@/libs/nextauth/prismaAdapterLinkAccount"

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

prismaAdapter.linkAccount = prismaAdapterLinkAccount

export var authOptions: AuthOptions = {
    adapter: prismaAdapter,
    providers: [
        AppleProvider({
            clientId: APPLE_ID,
            clientSecret: APPLE_SECRET,
        }),
        KakaoProvider({
            clientId: KAKAO_ID,
            clientSecret: KAKAO_SECRET,
        }),
        NaverProvider({
            clientId: NAVER_ID,
            clientSecret: NAVER_SECRET,
        }),
        FacebookProvider({
            clientId: FACEBOOK_ID,
            clientSecret: FACEBOOK_SECRET,
        }),
        InstagramProvider({
            clientId: INSTAGRAM_ID,
            clientSecret: INSTAGRAM_SECRET,
        }),
        PhoneNumberProvider(),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        // https://next-auth.js.org/configuration/callbacks#sign-in-callback
        // access_token이 DB에 업데이트되지 않는 문제 해결
        // https://github.com/nextauthjs/next-auth/issues/3599
        signIn: async ({ user, account, profile, email, credentials }) => {
            if (account) {
                const userFromDB = await prismaAdapter.getUser(user.id)

                if (account.provider == "phonenumber") {
                    return true
                }

                if (userFromDB) {
                    try {
                        await prisma.account.update({
                            where: {
                                provider_providerAccountId: {
                                    provider: account.provider,
                                    providerAccountId:
                                        account.providerAccountId,
                                },
                            },
                            data: {
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                id_token: account.id_token,
                                refresh_token: account.refresh_token,
                                session_state: account.session_state,
                                scope: account.scope,
                            },
                        })
                    } catch (err) {
                        if (err instanceof Error) {
                            console.error(err.message)
                        }
                        return false
                    }
                }
            }

            return true
        },

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
    session: {
        // CredentialsProvider 사용을 위해 (jwt만 사용 가능) 세션을 database 대신 jwt로 사용함
        // Session 테이블을 사용하지 않음
        maxAge: 4000000, //access_token이 재생산되지 않는 오류 해결해보기
        strategy: "jwt",
    },
}

// 개발 모드일 경우 디버그 활성화
if (process.env.NODE_ENV !== "production") {
    authOptions.debug = false
}

export default NextAuth(authOptions)
