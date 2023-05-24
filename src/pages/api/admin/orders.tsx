import { NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'
import { OrderAPIRequest, OrderItem } from '../orders'
import { Prisma } from '@prisma/client'
import { StoreInfo } from '../stores'

// 무슨 기능이나, 업데이트 내역...

// API Response 타입 지정
export type OrderAPIGETResponse = {
    // 가게에서 보는 주문내역들
    data: OrderItem[]
}

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
    const order = req.body.order
    const storeId = (req.query.storeId ?? '') as string

    const receiveQuery = req.query.q

    // API method에 따라 작동
    switch (req.method) {
        // GET (내 주문내역 정보 조회)
        case 'GET':
            if (receiveQuery != undefined && storeId == '') {
                // GET method에서 json파일을 query로 변환시켜서 GET에서 파라미터(쿼리)를 받아 다시 json으로 파싱
                // https://www.slingacademy.com/article/how-to-pass-a-javascript-array-within-a-query-string/'
                const stores = JSON.parse(receiveQuery as string)

                const readResult = await prisma.order.findMany({
                    where: {
                        status: 'COMPLETED',
                        OR: stores.map((store: StoreInfo) => {
                            const input: Prisma.OrderWhereInput = {
                                storeId: Number(store.id),
                            }
                            return input
                        }),
                    },
                    include: {
                        store: true,
                        orderDetails: { include: { menu: true } },
                    },
                })

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
            } else if (storeId != '' && receiveQuery == undefined) {
                const readResult = await prisma.order.findMany({
                    where: {
                        storeId: Number(storeId),
                        OR: [{ status: 'REQUESTED' }, { status: 'CONFIRMED' }, { status: 'CANCELED' }],
                    },
                    include: {
                        store: true,
                        orderDetails: { include: { menu: true } },
                    },
                })

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
            } else {
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
            }

        // UPDATE (주문 상태 변경)
        case 'PUT':
            const orders = req.body.orders

            if (orders == undefined || orders == null) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: 'orders 값은 필수입니다.',
                    },
                })
                return
            }

            orders.map(async (order) => {
                const input: Prisma.OrderUpdateManyWithWhereWithoutUserInput = {
                    where: { id: order.id },
                    data: { status: order.status },
                }
                await prisma.order.updateMany(input)
            })

            res.status(200).json({
                data: { success: true },
            })

            break

        // DELETE
        case 'DELETE':
            if (order == undefined || order == null) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '삭제 할 order가 없습니다.',
                    },
                })
                return
                // 매장 주인 여부 판단
            } else if (userId != order.store.userId) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '권한 불일치.',
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
