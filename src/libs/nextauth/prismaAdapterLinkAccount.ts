import prisma from '@/libs/prismadb'
import { AdapterAccount } from 'next-auth/adapters'

export default (account: AdapterAccount) => {
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

    return prisma.account.create({
        data: newAccount,
    }) as unknown as AdapterAccount
}
