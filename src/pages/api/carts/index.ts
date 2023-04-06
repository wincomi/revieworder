import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"
import { Prisma, OrderDetail } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

// API Request 타입 지정
export interface CartAPIRequest extends NextApiRequest {
    body: {
        order_details?: OrderDetail[] // POST에서 사용
    }
}

// API Response 타입 지정
const cartWithMenu = Prisma.validator<Prisma.CartArgs>()({
    include: { 
        menu: { include: { store: true } } 
     }
})

export type CartItem = Prisma.CartGetPayload<typeof cartWithMenu>

export type CartAPIGETResponse = {
    data: CartItem[]
}

// 세션의 userId 토대로 장바구니 조회 및 장바구니 초기화
// + reviewCard에 주문내역에 따른 메뉴들을 장바구니로 추가 API
export default (async (req: CartAPIRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    
    // 세션이 존재하는지 확인
    if (session == null) {
        res.status(401).json({
            error: {
                code: 401,
                message: "세션이 존재하지 않습니다."
            }
        })
        return
    }

    const userId = session.user.id

    // API method에 따라 작동
    switch (req.method) {
        // READ (세션에서 받아온 userId에 해당되는 내 장바구니 목록 조회)
        case "GET":
            const readResult = await prisma.cart.findMany({ 
                where: { user : { id: userId } },
                include: { 
                    menu: { include: { store: true } } 
                }
            })
            
            if (readResult != null) {
                // 성공!!
                res.status(200).json({
                    data: readResult
                })
            } else {
                res.status(404).json({
                    error: {
                        code: 400,
                        message: "장바구니 조회를 실패하였습니다."
                    }
                })
            }
            break

        // CREATE (reviewCard에 개시된 메뉴들을 장바구니로 추가)
        case "POST":
            const orderDetails = req.body.order_details

            if (orderDetails == undefined || orderDetails.length == 0) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "menu 값은 필수입니다."
                    }
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
                        amount: orderDetail.count
                    }
                    return input
                }),
                skipDuplicates: true
            })

            res.status(200).json({
                data: createResult
            })

            break

        // DELETE (userId에 해당하는 장바구니 다 삭제 -> 초기화)
        case "DELETE":
            const deleteResult = await prisma.cart.deleteMany({ where: { user: { id: userId }} })

            res.status(200).json({ 
                data: deleteResult 
            })

            break
    }
})
