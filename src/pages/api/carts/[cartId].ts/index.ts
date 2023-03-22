import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// cartId에 해당하는 장바구니 메뉴 수량 변경 및 해당 장바구니 메뉴 빼기 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
  
    const cartId: string | null = req.query.cartId as string ?? null
    
    // API method에 따라 작동
    switch (req.method) {

        // PUT (cartId에 해당되는 장바구니 메뉴 수량 변경)
        case "PUT":
            const putResult = await prisma.cart.update({
                where: { id: cartId },
                data: {
                    // 수량만 변경 가능하고 추가 삭제만 기능
                    count: (req.body.count),
                    userId: undefined,
                    menuId: undefined
                }
            })

            if (putResult != null) {
                // 성공!!
                res.status(200).json(putResult)
            } else {
                // 수정 실패.
                res.status(400).json({
                    "message": "수량 변경 실패..."
                })
            }
            break

        // DELETE (carId에 해당하는 장바구니 메뉴 제거)
        case "DELETE":
            const deleteResult = await prisma.cart.delete({
                where: { id: cartId }
            })
        
            if(deleteResult != null) {
                // 성공!!
                res.status(200).json(deleteResult)
            }else {
                // 수정 실패.
                res.status(400).json({
                    "message": "장바구니 제거 실패..."
                })
            }
            break
    }
}
