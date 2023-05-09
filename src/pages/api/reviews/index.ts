import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { Order, Prisma, Review } from "@prisma/client"

// API Request 타입 지정
export interface ReviewAPIRequest extends NextApiRequest {
    body: {
        // 관리 할 리뷰
        review?: Review & {order: Order}

        // 리뷰 등록 정보(create) : 새로 등록할 때만 사용
        inputReview?: Prisma.ReviewCreateInput
    }
}

// API Response 타입 지정
const ReviewWithOrder = Prisma.validator<Prisma.ReviewArgs>()({
    include: {
        order: {
            include: {
                store: true,
                user: true,
                orderDetails: { include: { menu: true } },
            },
        },
    },
})

export type ReviewItem = Prisma.ReviewGetPayload<typeof ReviewWithOrder>

export type ReviewAPIGETResponse = {
    data: ReviewItem[]
}

// 모든 리뷰 조회 및 등록 API
export default async (req: ReviewAPIRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    const query = req.query.q as string | undefined
    const review = req.body.review

    // API method에 따라 작동
    switch (req.method) {
        // GET (모든 리뷰 조회)
        case "GET":
            // 검색 쿼리 없으면 모두 출력
            if (query == "") {
                const readResult = await prisma.review.findMany({
                    include: {
                        order: {
                            include: {
                                store: true,
                                user: true,
                                orderDetails: {
                                    include: { menu: true },
                                },
                            },
                        },
                    },
                    orderBy: [
                        {
                            order: { userId: "desc" },
                        },
                        {
                            rating: "desc",
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
                            message: "리뷰 조회를 실패하였습니다.",
                        },
                    })
                }
                break
            } else {
                const readResult = await prisma.review.findMany({
                    where: {
                        OR: [
                            { content: { contains: query } },
                            { order: { store: { name: { contains: query } } } },
                        ],
                    },
                    include: {
                        order: {
                            include: {
                                store: true,
                                user: true,
                                orderDetails: {
                                    include: { menu: true },
                                },
                            },
                        },
                    },
                    orderBy: [
                        {
                            order: { userId: "desc" },
                        },
                        {
                            rating: "desc",
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
                            message: "리뷰 조회를 실패하였습니다.",
                        },
                    })
                }
                break
            }

        // CREATE (리뷰 등록)
        case "POST":
            const inputReview = req.body.inputReview

            // 세션이 존재하는지 확인
            if (session == null) {
                res.status(401).json({
                    error: {
                        code: 401,
                        message: "세션이 존재하지 않습니다.",
                    },
                })
                return
            }

            // name은 Not Null이기에 무조건 입력되게 표시
            if (inputReview == null || inputReview == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "등록 할 리뷰 정보을 입력해주세요.",
                    },
                })
                return
            } 
            
            const createResult = await prisma.review.create({
                // 리뷰
                data: inputReview,
                include: {
                    order: true,
                },
            })

            if (createResult != null) {
                // 성공!!
                res.status(200).json({
                    data: createResult,
                })
            }
            break
            
        
        // PUT (reviewId에 해당되는 리뷰 좋아요 정보 수정)
        case "PUT":
            if (review == null || review == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "관리 할 리뷰 값은 필수입니다.",
                    },
                })
                return
            }

            // 세션이 존재하는지 확인 + 본인 확인
            if (session == null) {
                res.status(401).json({
                    error: {
                        code: 401,
                        message: "세션이 존재하지 않습니다.",
                    },
                })
                return
            } else if (session.user.id != review.order.userId) {
                res.status(401).json({
                    error: {
                        code: 401,
                        message: "권한 불일치.",
                    },
                })
                return
            } 

            const putResult = await prisma.review.update({
                where: { id: review.id },
                data: {
                    // 나머지는 수정 불가 (초기에 리뷰는 생성, 삭제만 되게 설정)
                    favorite: review.favorite,
                    views: review.views
                },
            })

            if (putResult != null) {
                // 성공!!
                res.status(200).json(putResult)
            } else {
                // 수정 실패.
                res.status(400).json({
                    message: "정보 전달 실패...",
                })
            }
            break

        // DELETE (userId에 해당되는 유저 탈퇴)
        case "DELETE":
            if (review == null || review == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "관리 할 리뷰 값은 필수입니다.",
                    },
                })
                return
            }

            // 세션이 존재하는지 확인 + 본인 확인
            if (session == null) {
                res.status(401).json({
                    error: {
                        code: 401,
                        message: "세션이 존재하지 않습니다.",
                    },
                })
                return
            } else if (session.user.id != review.order.userId) {
                res.status(401).json({
                    error: {
                        code: 401,
                        message: "권한 불일치.",
                    },
                })
                return
            } 
                
            const deleteResult = await prisma.review.delete({
                where: { id: review.id },
            })

            if (deleteResult != null) {
                // 삭제 성공!!
                res.status(200).json(deleteResult)
            } else {
                // 삭제 실패.
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "해당 리뷰를 삭제할 수 없습니다.",
                    },
                })
            }
            break
              
        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({
                error: {
                    code: 400,
                    message: "잘못된 요청입니다.",
                },
            })
    }
}
