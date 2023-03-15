// https://next-auth.js.org/getting-started/typescript#main-module
import NextAuth from 'next-auth'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    }
  }
}
