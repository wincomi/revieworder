import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"
import { OrderDetail, Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

// res.status(200) - 성공!, res.status(400) - 실패!

// userId 토대로 장바구니 조회 및 장바구니 초기화
// + reviewCard에 주문내역에 따른 메뉴들을 장바구니로 추가 API
export default (async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    
    // 세션이 존재하는지 확인
    if (session == null) {
        res.status(400).json({
            "message": "세션이 존재하지 않습니다."
        })
        return
    }

    const userId = session.user.id

    // API method에 따라 작동
    switch (req.method) {
        // READ (userId에 해당되는 내 장바구니 목록 조회)
        case "GET":
            const readResult = await prisma.cart.findMany({ 
                where: { user : { id: userId } },
                include: { 
                    menu: { include: { store: true } } 
                }
            })
            
            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                res.status(400).json({
                    "message": "내 장바구니 조회 실패."
                })
            }
            break

        // CREATE (reviewCard에 개시된 메뉴들을 장바구니로 추가)
        case "POST":
            const orderDetails: OrderDetail[] | null = req.body.menu as OrderDetail[] ?? null

            if (orderDetails.length == 0 || orderDetails == null) {
                res.status(400).json({
                    "message": "menu 값은 필수입니다."
                })
                return
            }

            // 장바구니 초기화 후
            await prisma.cart.deleteMany({ where: { user: { id: userId }} })

            // 장바구니 테이블에 데이터들을 생성
            const createResult = await prisma.cart.createMany({
                data: orderDetails.map((orderDetail) => {
                    const input: Prisma.CartCreateManyInput = {
                        userId: userId,
                        menuId: orderDetail.menuId,
                        amount: orderDetail.amount
                    }
                    return input
                }),
                skipDuplicates: true
            })

            res.status(200).json({
                success: 'success',
                data: createResult
            })

            break

        // DELETE (userId에 해당하는 장바구니 다 삭제 -> 초기화)
        case "DELETE":
            const deleteResult = await prisma.cart.deleteMany({ where: { user: { id: userId }} })

            res.status(200).json({ 
                success: 'success',
                data: deleteResult 
            })

            break
    }
})
