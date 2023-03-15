import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// 모든 매장 조회 및 등록 API
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // API method에 따라 작동
    switch (req.method) {
        
        // GET (모든 매장 조회)
        case "GET":
            const readResult = await prisma.store.findMany()

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                // 요청된 정보가 없음
                res.status(400).json({
                    "message": "store 정보가 없습니다."
                })
            }
            break

        // CREATE (매장 등록)
        case "POST":
            // name은 Not Null이기에 무조건 입력되게 표시
            if (req.body.name == null) {
                res.status(400).json({
                    "message": "가게 이름을 입력해주세요."
                })
            } else {
                const createResult = await prisma.store.create({
                    // 매장 이름, 주소, 전화번호, 설명
                    data: {
                        name: req.body.name,
                        address: req.body.address,
                        phoneNumber: req.body.phoneNumber,
                        description: req.body.description,
                        image: req.body.image,

                        // 유저 FK키
                        userId : req.body.userId,
                    }
                })

                if (createResult != null) {
                    // 성공!!
                    res.status(200).json(createResult)
                } else {
                    // 결과 값이 없을때 오류
                    res.status(400).json({
                        "message": "store를 등록할 수 없습니다."
                    })
                }
            }
            break

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({ message: "잘못된 요청" })
    }
}

