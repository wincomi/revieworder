import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// orderMenuId 쿼리를 받아와서 그 Id에 해당하는 장바구니 조회, 수정, 삭제 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    // string 타입 ( query : api/reviews/1 )
    const orderMenuId: string | null = req.query.orderMenuId as string ?? null
    
    // API method에 따라 작동
    switch (req.method) {
        
        // READ (orderMenuId에 해당되는 장바구니의 메뉴 조회)
        // 내 장바구니에 있는 메뉴들 중 하나의 정보를 받아온다. 
        // -> 이거 사용해서 menuId로 메뉴 정보 불러온다. (설계 이유: 정규화한다고...)
        case "GET":
            const readResult = await prisma.orderMenu.findUnique({where: { id : orderMenuId }})

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                res.status(400).json({
                    "message": "해당 장바구니의 메뉴 정보가 없습니다."
                })
            }
            break

        // DELETE (장바구니의 메뉴 제거)
        case "DELETE":
            const deleteResult = await prisma.orderMenu.delete({where: { id: orderMenuId }})

            if (deleteResult != null) {
                // 삭제 성공!!
                res.status(200).json(deleteResult)
            } else {
                // 삭제 실패.
                res.status(400).json({
                    "message": "해당 장바구니의 메뉴를 삭제할 수 없습니다."
                })
            }
            break

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({ message: "잘못된 요청" })
    }
}
