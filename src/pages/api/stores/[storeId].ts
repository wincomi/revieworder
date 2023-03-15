import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// storeId 쿼리를 받아와서 그 Id에 해당하는 매장 조회, 수정, 삭제 API
export default async (req: NextApiRequest, res: NextApiResponse) => {

    // storeId를 쿼리로 받아오는데 int or null
    const storeId: number | null = Number(req.query.storeId) as number ?? null
    
    // API method에 따라 작동
    switch (req.method) {
        
        // READ (storeId에 해당되는 매장 조회)
        case "GET":
            const readResult = await prisma.store.findUnique({where: { id : storeId }})

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                res.status(400).json({
                    "message": "해당 store정보가 없습니다."
                })
            }
            break

        // PUT (storeId에 해당되는 매장 정보 수정)
        case "PUT":
            if (req.body.name == null) {
                res.status(400).json({
                    "message": "매장 이름을 입력해주세요."
                })
            } else {
                const putResult = await prisma.store.update({
                    where: { id: storeId },
                    // 매장 이름, 주소, 전화번호, 설명
                    data: {
                        // null : no value, undefined : do nothing => 변경사항 없으면 변경X
                        name: req.body.name != null ? req.body.name : undefined,
                        address: req.body.address != null ? req.body.address : undefined,
                        phoneNumber: req.body.phoneNumber != null ? req.body.phoneNumber : undefined,
                        description: req.body.description != null ? req.body.description : undefined,
                        image: req.body.image != null ? req.body.image : undefined,
                    }
                })

                if (putResult != null) {
                    // 성공!!
                    res.status(200).json(putResult)
                } else {
                    // 수정 실패.
                    res.status(400).json({
                        "message": "해당 store를 수정할 수 없습니다."
                    })
                }
            }
            break

        // DELETE (storeId에 해당되는 매장 정보 삭제)
        case "DELETE":
            const deleteResult = await prisma.store.delete({where: { id: storeId }})

            // 삭제하면 deleteResult 값이 있나?
            if (deleteResult != null) {
                // 삭제 성공!!
                res.status(200).json(deleteResult)
            } else {
                // 삭제 실패.
                res.status(400).json({
                    "message": "해당 store를 삭제할 수 없습니다."
                })
            }
            break

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({ message: "잘못된 요청" })
        }
}