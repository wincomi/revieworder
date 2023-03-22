import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// userId 토대로 장바구니 조회 및 장바구니 초기화 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    const userId: string | null = String(req.body.userId) as string ?? null
    
    // API method에 따라 작동
    switch (req.method) {
        // READ (userId에 해당되는 내 장바구니 목록 조회)
        case "GET":
            const readResult = await prisma.cart.findMany({ 
                where: { user : {id: userId} },
                include: { user: true }
            })

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                res.status(400).json({
                    "message": "내 장바구니 조회 실패."
                })
            }
            break

        // DELETE (userId에 해당하는 장바구니 다 삭제 -> 초기화)
        case "DELETE":
            const deleteResult = await prisma.cart.deleteMany({
                where: { user: {id: userId}}
            })
            break
    }
}
