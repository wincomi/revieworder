import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// 모든 유저 조회 및 등록 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    // API method에 따라 작동
    switch (req.method) {

        // GET (모든 유저 조회)
        // 권한 없는 유저가 모든 유저를 조회할 수도 있기 때문에 추후 변경할 것
        // 대신 libs/users.ts의 getUsers() 사용
        case "GET":
            const readResult = await prisma.user.findMany()

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                // 요청된 정보가 없음
                res.status(400).json({
                    "message": "유저 정보가 없습니다."
                })
            }
            break

        // CREATE (sns 연동 외 회원가입)
        case "POST":
            const createResult = await prisma.user.create({
                // 유저 이름, 이메일, 비밀번호, 전화번호, 프로필 사진, 이메일 인증 시간?
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    phoneNumber: req.body.phoneNumber,
                    image: req.body.image,
                    emailVerified: req.body.emailVerified,
                }
            })

            if (createResult != null) {
                // 성공!!
                res.status(200).json(createResult)
            } else {
                // 결과 값이 없을때 오류
                res.status(400).json({
                    "message": "유저를 등록할 수 없습니다."
                })
            }
            break

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({ message: "잘못된 요청입니다." })
    }
}
