import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

type GetReviewId = {
    id: number
}

export type ReviewIdAPIGETResponse = {
    data: GetReviewId
}

// 모든 리뷰 조회 및 등록 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)

    //세션이 존재하는지 확인 + 본인 확인
    if (session == null) {
        res.status(401).json({
            error: {
                code: 401,
                message: '세션이 존재하지 않습니다.',
            },
        })
        return
    }

    // API method에 따라 작동
    switch (req.method) {
        // GET (모든 리뷰 조회)
        case 'GET':
            const userId = session?.user.id

            const readResult = await prisma.review.findFirst({
                select: { id: true },
                where: { order: { userId: userId } },
                orderBy: [
                    {
                        order: { orderDate: 'desc' },
                    },
                ],
            })

            if (readResult != null) {
                // 성공!!
                res.status(200).json({
                    data: readResult,
                })
            } else {
                res.status(404).json({
                    error: {
                        code: 400,
                        message: '리뷰 조회를 실패하였습니다.',
                    },
                })
            }
            break

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({
                error: {
                    code: 400,
                    message: '잘못된 요청입니다.',
                },
            })
    }
}
