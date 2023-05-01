import prisma from "@/libs/prismadb"
import { User } from "@prisma/client"

/// 연동된 유저의 계정 Provider 가져오기
/// 예) kakao, naver, ...
// async일 경우 반환형이 Promise
export async function getAccountProviders(userId: string): Promise<string[] | undefined> {
    const userResult = await prisma.user.findUnique({
        where: { id: userId },
        include: { accounts: true } // User와 Account를 Join
    })

    const providers = userResult?.accounts.map((account) => { return account.provider })

    return providers
}

/// 모든 유저 조회 - 권한 있는 유저만 사용할 것
export async function getUsers(): Promise<User[]> {
    return await prisma.user.findMany()
}
