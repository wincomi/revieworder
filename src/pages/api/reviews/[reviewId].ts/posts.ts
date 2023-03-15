import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// userId 쿼리를 받아와서 내 리뷰 조회
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    const userId: string | null = String(req.query.userId) as string ?? null
    
    // API method에 따라 작동
    switch (req.method) {
        
        // READ (reviewId에 해당되는 리뷰들 조회)
        case "GET":
            const readResult = await prisma.review.findMany({where: { userId: userId }})

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                res.status(400).json({
                    "message": "내 review정보가 없습니다."
                })
            }
            break
    }
}
