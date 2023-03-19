import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// userId 쿼리를 받아와서 그 Id에 해당하는 유저 조회, 수정, 삭제 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    // String 타입 ( query : api/users/1 )
    const userId: string | null = String(req.query.userId) as string ?? null
    
    // API method에 따라 작동
    switch (req.method) {
        
        // READ (userId에 해당되는 유저 조회)
        case "GET":
            const readResult = await prisma.user.findUnique({where: { id : userId }})

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                res.status(400).json({
                    "message": "해당 유저 정보가 없습니다."
                })
            }
            break

        // PUT (userId에 해당되는 유저 정보 수정)
        case "PUT":
            const putResult = await prisma.user.update({
                where: { id: userId },
                // 유저 이름, 주소, 전화번호, 프로필 사진
                data: {
                    // null : no value, undefined : do nothing => 변경사항 없으면 변경X
                    name: req.body.name != null ? req.body.name : undefined,
                    email: req.body.email != null ? req.body.email : undefined, 
                    password: req.body.password != null ? req.body.password : undefined, 
                    phoneNumber: req.body.phoneNumber != null ? req.body.phoneNumber : undefined, 
                    image: req.body.image != null ? req.body.image : undefined, 
                    emailVerified: req.body.emailVerified != null ? req.body.emailVerified : undefined, 
                }
            })

            if (putResult != null) {
                // 성공!!
                res.status(200).json(putResult)
            } else {
                // 수정 실패.
                res.status(400).json({
                    "message": "해당 유저를 수정할 수 없습니다."
                })
            }
            break

        // DELETE (userId에 해당되는 유저 탈퇴)
        case "DELETE":
            const deleteResult = await prisma.user.delete({ where: { id: userId }})

            // 삭제하면 deleteResult 값이 있나?
            if (deleteResult != null) {
                // 삭제 성공!!
                res.status(200).json(deleteResult)
            } else {
                // 삭제 실패.
                res.status(400).json({
                    "message": "해당 유저를 삭제할 수 없습니다."
                })
            }
            break
    }
}
