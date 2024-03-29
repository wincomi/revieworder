import { NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { StoreAPIRequest, StoreInfo } from '../stores'

// API Response 타입 지정

// 가게 메뉴 출력은 menus API 사용
export type StoreAPIGETResponse = {
    data: StoreInfo[]
}

export default async (req: StoreAPIRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)

    const storeId = (req.query.id ?? '') as string

    const store = req.body.store
    const inputStore = req.body.inputStore

    // API method에 따라 작동
    switch (req.method) {
        // 매장 검색 시에는 query만 이용하다 해당 매장 페이지 들어가면 storeId 쿼리 사용
        case 'GET':
            if (storeId == '') {
                // 검색 쿼리 없을 때 userId 토대로 조회 (admin 용)
                const readResult = await prisma.store.findMany({
                    where: { userId: session?.user.id },
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

            if (storeId != '') {
                // storeId에 해당하는 매장 정보
                const readResult = await prisma.store.findUnique({
                    where: {
                        id: Number(storeId),
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
            }

        // CREATE (매장 등록)
        case 'POST':
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

            // name은 Not Null이기에 무조건 입력되게 표시
            if (inputStore == null || inputStore == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '등록 할 매장 정보을 입력해주세요.',
                    },
                })
                return
            } else {
                const createResult = await prisma.store.create({
                    // 매장 이름, 주소, 전화번호, 설명
                    data: { ...inputStore, user: { connect: { id: session.user.id } } },
                })

                if (createResult != null) {
                    // 성공!!
                    res.status(200).json(createResult)
                } else {
                    // 결과 값이 없을때 오류
                    res.status(400).json({
                        message: '매장을 등록할 수 없습니다.',
                    })
                }
            }
            break

        // PUT (storeId에 해당되는 매장 정보 수정)
        case 'PUT':
            if (store == null || store == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '관리 매장 없음.',
                    },
                })
                return
            }

            // 세션이 존재하는지 확인
            if (session == null) {
                res.status(401).json({
                    error: {
                        code: 401,
                        message: '세션이 존재하지 않습니다.',
                    },
                })
                return
            } else if (session.user.id != store.userId) {
                res.status(401).json({
                    error: {
                        code: 401,
                        message: '매장 관리자 불일치.',
                    },
                })
                return
            }

            const putResult = await prisma.store.update({
                where: { id: store.id },
                // 매장 이름, 주소, 전화번호, 설명
                data: {
                    name: store.name,
                    address: store.address,
                    phoneNumber: store.phoneNumber,
                    description: store.description,
                    image: store.image,
                },
            })

            if (putResult != null) {
                // 성공!!
                res.status(200).json(putResult)
            } else {
                // 수정 실패.
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '해당 매장을 수정할 수 없습니다.',
                    },
                })
            }

            break

        // DELETE (storeId에 해당되는 매장 정보 삭제)
        case 'DELETE':
            if (store == null || store == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '관리 매장 없음.',
                    },
                })
                return
            }

            // 세션이 존재하는지 확인
            if (session == null) {
                res.status(401).json({
                    error: {
                        code: 401,
                        message: '세션이 존재하지 않습니다.',
                    },
                })
                return
            } else if (session.user.id != store.userId) {
                res.status(401).json({
                    error: {
                        code: 401,
                        message: '매장 관리자 불일치.',
                    },
                })
                return
            }

            const deleteResult = await prisma.store.delete({
                where: { id: store.id },
            })

            if (deleteResult != null) {
                // 삭제 성공!!
                res.status(200).json(deleteResult)
            } else {
                // 삭제 실패.
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '해당 store를 삭제할 수 없습니다.',
                    },
                })
            }
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
