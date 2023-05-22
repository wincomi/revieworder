import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { Prisma, Store } from '@prisma/client'

// API Request 타입 지정
export interface StoreAPIRequest extends NextApiRequest {
    body: {
        //관리 할 매장
        store?: Store

        // 매장 등록 정보(create) : 새로 등록할 때만 사용
        inputStore?: Prisma.StoreCreateInput
    }
}

// API Response 타입 지정
const store = Prisma.validator<Prisma.StoreArgs>()({
    include: { user: true },
})

export type StoreInfo = Prisma.StoreGetPayload<typeof store>

// 가게 메뉴 출력은 menus API 사용
export type StoreAPIGETResponse = {
    data: StoreInfo[]
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const query = (req.query.q ?? '') as string
    const storeId = (req.query.id ?? '') as string

    // API method에 따라 작동
    switch (req.method) {
        // 매장 검색 시에는 query만 이용하다 해당 매장 페이지 들어가면 storeId 쿼리 사용
        case 'GET':
            if (query == '' && storeId == '') {
                // 검색 쿼리, storeId 없을 때
                const readResult = await prisma.store.findMany({})

                if (readResult != null) {
                    // 성공!!
                    res.status(200).json({
                        data: readResult,
                    })
                } else {
                    res.status(404).json({
                        error: {
                            code: 400,
                            message: '매장 조회를 실패하였습니다.',
                        },
                    })
                }
                break
            } else if (query != '' && storeId == '') {
                // 검색 쿼리 있을 때
                const readResult = await prisma.store.findMany({
                    where: {
                        OR: [
                            // 쿼리에서 매장 이름, 주소, 설명 검색
                            { name: { contains: query } },
                            { address: { contains: query } },
                            { description: { contains: query } },
                        ],
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
                            message: '매장 조회를 실패하였습니다.',
                        },
                    })
                }
                break
            } else if (query != '' && storeId == '') {
                // 검색 쿼리 없을 때 userId 토대로 조회 (admin 용)
                const readResult = await prisma.store.findUnique({
                    where: { id: Number(storeId) },
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
                            message: '매장 조회를 실패하였습니다.',
                        },
                    })
                }
                break
            }

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
