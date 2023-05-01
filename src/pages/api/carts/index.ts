import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"
import { Prisma, OrderDetail, Cart, Menu } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

// API Request 타입 지정
export interface CartAPIRequest extends NextApiRequest {
    body: {
        // order_detail인 이유는 리뷰페이지 장바구니로
        order_details?: OrderDetail[] // POST에서 사용

        // 가게페이지에서 메뉴 장바구니로
        menu?: Menu

        // 자동 Update용 carts
        carts?: Cart[]

        // 개별 삭제용
        cart?: Cart
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


        // CREATE 
        // 리뷰페이지에서 담으면 orderDetails로 
        // 가게 메뉴페이지에서 담으면 menu 참조. 이때 장바구니에 담기는 메뉴는 amount 1로 고정, 나중에 고객이 수정.
        case "POST":
            const orderDetails = req.body.order_details
            const menu = req.body.menu

            // orderDetails가 오면
            if (orderDetails != null || orderDetails != undefined){
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
                    data: createResult
                })

            // menu가 오면
            } else if (menu != null || menu != undefined) {
                const createResult = await prisma.cart.create({
                    data: {
                        user: { connect: { id: userId }},
                        menu: { connect: { id: menu.id }}
                    }
                })

                res.status(200).json({
                    data: createResult
                })

            // 둘 다 안 오면
            } else {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "필요(orderDetail or menu) 값은 필수입니다."
                    }
                })
                return
            }

            break

        // PUT 수정 시 전체 업데이트
        case "PUT":
            const carts = req.body.carts

                if (carts == undefined || carts.length == 0) {
                    res.status(400).json({
                        error: {
                            code: 400,
                            message: "cart 값은 필수입니다."
                        }
                    })
                    return
                }

                // updateMany 하려다 실패..

                // const putResult = await prisma.cart.updateMany({
                //     data: carts.map((cart) => {
                //         const input: Prisma.CartUpdateManyWithWhereWithoutUserInput = {
                //             where: { id: cart.id },
                //             data: { amount: cart.amount }
                //         }
                //         return input
                //     }),
                // })

                carts.map(async (cart) => {
                    const input: Prisma.CartUpdateManyWithWhereWithoutUserInput = {
                        where: { id: cart.id },
                        data: { amount: cart.amount }
                    }

                    const putResult = await prisma.cart.updateMany(input)

                    // Cannot set headers after they are sent to the client
                    // res.status(200).json({
                    //     data: putResult
                    // })
                })

                res.status(200).json({
                    data: { success: true }
                })

            break

        // DELETE (cartId로 개별 삭제)
        // TODO: 자신의 카트인지 확인해야함
        case "DELETE":
            const cart = req.body.cart

            if (cart == undefined || cart == null) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "cart 값은 필수입니다."
                    }
                })
                return
            }

            const deleteResult = await prisma.cart.delete({
                where: { id: cart.id }
            })
        
            res.status(200).json({ 
                data: deleteResult 
            })

            break
    }
})
