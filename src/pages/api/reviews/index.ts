import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// 모든 리뷰 조회 및 등록 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    // API method에 따라 작동
    switch (req.method) {

        // GET (모든 리뷰 조회)
        case "GET":
            const readResult = await prisma.review.findMany({
                include: { 
                    order: {
                        include: {
                            store: true,
                            user: true, 
                            orderDetail: {
                                include: {menu: true}
                            }
                        }
                    }
                },
                orderBy: [
                    {
                    createTime: 'desc'
                    },
                    {
                        rating: 'desc'
                    }
                ]
            })

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                // 요청된 정보가 없음
                res.status(400).json({
                    "message": "리뷰 정보가 없습니다."
                })
            }
            break

        // CREATE (리뷰 등록)
        case "POST":

            if (req.body.content == null) {
                res.status(400).json({
                    "message": "리뷰 내용을 입력해주세요."
                })
            } else {
                const createResult = await prisma.review.create({
                    // 리뷰 
                    data: {
                        content: req.body.content,
                        image: req.body.image,

                        // 외래키 연결
                        order: {
                            connect: { id: req.body.orderId }
                        }
                    },
                    include: {
                        order: true,
                    }
                })

                if (createResult != null) {
                    // 성공!!
                    res.status(200).json(createResult)
                } else {
                    // 결과 값이 없을때 오류
                    res.status(400).json({
                        "message": "리뷰를 게시 실패."
                    })
                }
                break
            }

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({ message: "잘못된 요청" })
    }
}
