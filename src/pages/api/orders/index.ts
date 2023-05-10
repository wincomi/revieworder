import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { Cart, Order, Prisma, Store } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { CartItem } from '../carts'

// 무슨 기능이나, 업데이트 내역...

// API Request 타입 지정
export interface OrderAPIRequest extends NextApiRequest {
    body: {
        /// 장바구니 추가된 정보 목록
        // cart안에 storeId 찾는 용도
        carts?: CartItem[]

        /// 매장 측 정보 - 매장 측에서 주문 내역 조회 할 때
        store?: Store[]

        // 주문 취소용
        order?: Order
    }
}

// API Response 타입 지정
const orderWithOrderDetail = Prisma.validator<Prisma.OrderArgs>()({
    include: {
        store: true,
        orderDetails: { include: { menu: true } },
    },
})

export type OrderItem = Prisma.OrderGetPayload<typeof orderWithOrderDetail>

export type OrderAPIGETResponse = {
    // 가게에서 보는 주문내역들
    data: OrderItem[]
}

//
export default async (req: OrderAPIRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)

    // 세션이 존재하는지 확인
    if (session == null) {
        res.status(401).json({
            error: {
                code: 401,
                message: '세션이 존재하지 않습니다.',
            },
        })
        return
    }

    const userId = session.user.id
    const carts = req.body.carts
    const order = req.body.order

    // API method에 따라 작동
    switch (req.method) {
        // GET (내 주문내역 정보 조회)
        case 'GET':
            const readResult = await prisma.order.findMany({
                where: {
                    userId: userId,
                    // TODO: 나중에 쿼리로 할 변경
                    OR: [{ status: 'REQUESTED' }, { status: 'CONFIRMED' }],
                },
                include: {
                    store: true,
                    orderDetails: { include: { menu: true } },
                },
            })
            console.log(readResult)
            if (readResult != null) {
                // 성공!!
                res.status(200).json({
                    data: readResult,
                })
            } else {
                res.status(404).json({
                    error: {
                        code: 400,
                        message: '주문내역 조회를 실패하였습니다.',
                    },
                })
            }
            break

        // CREATE (장바구니에서 주문)
        case 'POST':
            if (carts == undefined || carts == null) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: 'carts 값은 필수입니다.',
                    },
                })
                return
            } else if (userId != carts[0].userId) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '유저 정보 불일치.',
                    },
                })
                return
            }

            const createResult = await prisma.order.create({
                data: {
                    // 어차피 가게는 한 곳에서만 주문하는 거니까
                    store: { connect: { id: carts[0].menu.storeId } },
                    user: { connect: { id: userId } },

                    orderDetails: {
                        createMany: {
                            data: carts.map((menu) => {
                                const input: Prisma.OrderDetailCreateManyOrderInput = {
                                    menuId: menu.menuId,
                                    amount: menu.amount,
                                    price: menu.amount * menu.menu.price,
                                }
                                return input
                            }),
                        },
                    },
                },
                include: { orderDetails: true },
            })

            if (createResult != null) {
                // 성공!!
                res.status(200).json({
                    data: createResult,
                })
            } else {
                // 결과 값이 없을때 오류
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '주문을 실패 하였습니다.',
                    },
                })
            }
            break

        // UPDATE (주문 상태 변경)
        case 'PUT':
            if (carts == undefined || carts == null) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: 'order 값은 필수입니다.',
                    },
                })
                return
            }

        // const updateResult = await prisma.order.create({
        //     data: {
        //         status:
        //     }
        // })

        // if (updateResult != null) {
        //     // 성공!!
        //     res.status(200).json({
        //         data: updateResult
        //     })
        // } else {
        //     // 결과 값이 없을때 오류
        //     res.status(400).json({
        //         error: {
        //             code: 400,
        //             message: "주문 상태 변경을 실패 하였습니다."
        //         }
        //     })
        // }
        // break

        // DELETE (몇 분이내면 삭제 가능?)
        case 'DELETE':
            if (order == undefined || order == null) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '삭제 할 order가 없습니다.',
                    },
                })
                return
            } else if (userId != order.userId) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '유저 정보 불일치.',
                    },
                })
                return
            }

            const deleteResult = await prisma.order.delete({
                where: { id: order.id },
            })

            res.status(200).json({
                data: deleteResult,
            })

            break

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({
                error: {
                    code: 400,
                    message: '잘못된 요청입니다.',
                },
            })
    }
}
