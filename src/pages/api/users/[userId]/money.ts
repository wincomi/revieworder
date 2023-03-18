import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// userId 쿼리를 받아와서 그 Id에 해당하는 유저의 리뷰머니 관리 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    // String 타입 ( query : api/users/1/money )
    const userId: string | null = String(req.query.userId) as string ?? null

    // API method에 따라 작동
    switch (req.method) {

        // PUT (리뷰머니 변동)
        case "PUT":
            const putResult = await prisma.user.update({
                where: { id: userId },
                // 유저 리뷰 머니
                data: {
                    // null : no value, undefined : do nothing
                    money: req.body.money != null ? req.body.money : undefined
                }
            })
            break
    }
}
