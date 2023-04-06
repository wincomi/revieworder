import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// cart 생성 API - 장바구니 메뉴 등록
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    // API method에 따라 작동
    switch (req.method) {

        // CREATE (장바구니 메뉴 추가)
        case "POST":
            const createResult = await prisma.cart.create({
                // 장바구니 수량 및 유저,메뉴 외래키
                data: {
                    amount: req.body.amount,
                    // 외래키
                    user: { connect: {
                        id: req.body.userId
                    }},
                    menu: { connect: {
                        id: req.body.menuId
                    }}
                },
                include: {
                    user: true,
                    menu: true,
                }
            })

            if (createResult != null) {
                // 성공!!
                res.status(200).json(createResult)
            } else {
                // 결과 값이 없을때 오류
                res.status(400).json({
                    "message": "장바구니 추가 실패."
                })
            }
            break

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({ message: "잘못된 요청입니다." })
    }
}