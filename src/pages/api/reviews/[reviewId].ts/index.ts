import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// reviewId 쿼리를 받아와서 그 Id에 해당하는 리뷰 조회, 수정, 삭제 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    // number 타입 ( query : api/reviews/1 )
    const reviewId: number | null = Number(req.query.reviewId) as number ?? null
    
    // API method에 따라 작동
    switch (req.method) {
        
        // READ (reviewId에 해당되는 리뷰 조회)
        case "GET":
            const readResult = await prisma.review.findUnique({where: { id : reviewId }})

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                res.status(400).json({
                    "message": "해당 review정보가 없습니다."
                })
            }
            break

        // DELETE (userId에 해당되는 유저 탈퇴)
        case "DELETE":
            const deleteResult = await prisma.review.delete({where: { id: reviewId }})

            if (deleteResult != null) {
                // 삭제 성공!!
                res.status(200).json(deleteResult)
            } else {
                // 삭제 실패.
                res.status(400).json({
                    "message": "해당 review를 삭제할 수 없습니다."
                })
            }
            break
    }
}
