// https://next-auth.js.org/getting-started/typescript#main-module
import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            // DefaultSession.user
            name?: string | null | undefined
            email?: string | null | undefined
            image?: string | null | undefined

            // Custom
            id: string
        }
    }
}
