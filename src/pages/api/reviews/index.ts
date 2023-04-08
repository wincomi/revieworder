import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { Prisma, Review } from '@prisma/client'

// API Request 타입 지정
export interface ReviewAPIRequest extends NextApiRequest {
    body: {
        // 관리 할 리뷰  
        review?: Review

    }
}

// API Response 타입 지정
const ReviewWithOrder = Prisma.validator<Prisma.ReviewArgs>()({
    include: { 
        order: { include: { 
            store: true,
            user: true, 
            orderDetails: { include: { menu: true }}}}
     }
})

export type ReviewItem = Prisma.ReviewGetPayload<typeof ReviewWithOrder>

export type ReviewAPIGETResponse = {
    data: ReviewItem[]
}


// 모든 리뷰 조회 및 등록 API
export default async (req: ReviewAPIRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    const search = req.query.search as string | undefined

    // API method에 따라 작동
    switch (req.method) {

        // GET (모든 리뷰 조회)
        case "GET":
            // 검색 쿼리 없으면 모두 출력
            if (search ==""){

                const readResult = await prisma.review.findMany({
                    include: { 
                        order: {
                            include: {
                                store: true,
                                user: true, 
                                orderDetails: {
                                    include: { menu: true }
                                }
                            }
                        }
                    },
                    orderBy: [
                        {
                            order: { userId: 'desc' }
                        },
                        {
                            rating: 'desc'
                        }
                    ]
                })

                if (readResult != null) {
                    // 성공!!
                    res.status(200).json({
                        data: readResult
                    })
                } else {
                    res.status(404).json({
                        error: {
                            code: 400,
                            message: "리뷰 조회를 실패하였습니다."
                        }
                    })
                }
                break

            } else {
                const readResult = await prisma.review.findMany({
                    where: { content: { contains: search }},
                    include: { 
                        order: {
                            include: {
                                store: true,
                                user: true, 
                                orderDetails: {
                                    include: { menu: true }
                                }
                            }
                        }
                    },
                    orderBy: [
                        {
                            order: { userId: 'desc' }
                        },
                        {
                            rating: 'desc'
                        }
                    ]
                })

                if (readResult != null) {
                    // 성공!!
                    res.status(200).json({
                        data: readResult
                    })
                } else {
                    res.status(404).json({
                        error: {
                            code: 400,
                            message: "리뷰 조회를 실패하였습니다."
                        }
                    })
                }
                break
            }

        // CREATE (리뷰 등록)
        case "POST":
            const review = req.body.review

            // 세션이 존재하는지 확인
            if (session == null) {
                res.status(401).json({
                    error: {
                    code: 401,
                    message: "세션이 존재하지 않습니다."
                    }
                })
            return
            }

            if (review == null || review == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "리뷰 값은 필수입니다."
                    }
                })
                return
            }
            
            if (review.content == null) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "리뷰 내용을 입력해주세요."
                    }
                })
            } else {
                const createResult = await prisma.review.create({
                    // 리뷰 
                    data: {
                        content: review.content,
                        image: review.image,

                        // 외래키 연결
                        order: {
                            connect: { id: review.orderId }
                        }
                    },
                    include: {
                        order: true,
                    }
                })

                if (createResult != null) {
                    // 성공!!
                    res.status(200).json({
                        data: createResult
                    })
                } 
                break
            }

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({ message: "잘못된 요청" })
    }
}
