import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// reviewId 쿼리를 받아와서 그 Id에 해당하는 리뷰 조회, 수정, 삭제 API
//
export default async (req: NextApiRequest, res: NextApiResponse) => {
    var reviewId: number | null = null
    var search: string | null = null

    // api/reviews/query (query = reviewId OR search )
    if (typeof req.query.typeQuery === "number") {
        reviewId = (Number(req.query.typeQuery) as number) ?? null
    } else if (typeof req.query.typeQuery === "string") {
        search = (req.query.typeQuery as string) ?? null
    }

    // API method에 따라 작동
    switch (req.method) {
        // READ (reviewId에 해당되는 리뷰 조회)
        case "GET":
            if (reviewId != null) {
                const readResult = await prisma.review.findMany({
                    where: { id: reviewId },
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
                    res.status(200).json(readResult)
                } else {
                    res.status(400).json({
                        message: "해당 리뷰 정보가 없습니다.",
                    })
                }
                break
            } else if (search != null) {
                const readResult = await prisma.review.findMany({
                    where: {
                        content: { contains: search },
                    },
                })

                if (readResult != null) {
                    res.status(200).json(readResult)
                } else {
                    res.status(400).json({
                        message: "해당 검색 결과가 없습니다.",
                    })
                }
                break
            }
        // DELETE (userId에 해당되는 유저 탈퇴)
        case "DELETE":
            if (reviewId != null) {
                const deleteResult = await prisma.review.delete({
                    where: { id: reviewId },
                })

                if (deleteResult != null) {
                    // 삭제 성공!!
                    res.status(200).json(deleteResult)
                } else {
                    // 삭제 실패.
                    res.status(400).json({
                        message: "해당 리뷰를 삭제할 수 없습니다.",
                    })
                }
                break
            }
    }
}
