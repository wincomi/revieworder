import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// reviewId 쿼리를 받아와서 그 Id에 해당하는 리뷰 좋아요 수 관리 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    const reviewId: number | null = Number(req.query.reviewId) as number ?? null
    
    // API method에 따라 작동
    switch (req.method) {

        // PUT (reviewId에 해당되는 리뷰 좋아요 정보 수정)
        case "PUT":
            const putResult = await prisma.review.update({
                where: { id: reviewId },
                data: {
                    // favorite 말고 나머지 다 Null 전달
                    // 이거 되려나?
                    favorite: (req.body.favorite + 1)
                }
            })

            if (putResult != null) {
                // 성공!!
                res.status(200).json(putResult)
            } else {
                // 수정 실패.
                res.status(400).json({
                    "message": "좋아요 실패..."
                })
            }
        break
    }
}
