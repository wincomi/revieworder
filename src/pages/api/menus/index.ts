import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/libs/prismadb'
import { Menu, Prisma, Store } from '@prisma/client'

// API Request 타입 지정
export interface MenuAPIRequest extends NextApiRequest {
    body: {
        /// 변경할 메뉴
        menu?: Menu

        /// 등록할 메뉴 정보
        inputMenu?: Prisma.MenuCreateInput
    }
}

// API Response 타입 지정
const menuWithStore = Prisma.validator<Prisma.MenuArgs>()({
    include: {
        store: true,
    },
})

export type MenuItem = Prisma.MenuGetPayload<typeof menuWithStore>

export type MenuAPIGETResponse = {
    // 해당 매장 메뉴들
    data: MenuItem | MenuItem[]
}

// 모든 메뉴 조회 및 등록 API
export default async (req: MenuAPIRequest, res: NextApiResponse) => {
    // GET 조회 때 오는 정보
    const storeId = req.query.storeId as string | undefined
    const menuId = req.query.id as string | undefined

    // body에서 정보
    const menu = req.body.menu
    const inputMenu = req.body.inputMenu
    const store = inputMenu?.store as Store

    // API method에 따라 작동
    switch (req.method) {
        // GET (모든 메뉴 조회)
        case 'GET':
            // storeId는 매장 메뉴들 조회, menuId에 해당 메뉴 정보 조회
            if (storeId == undefined && menuId == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '매장 번호 x, 메뉴 정보 x',
                    },
                })
            } else if (storeId != undefined && menuId == undefined) {
                const readResult = await prisma.menu.findMany({
                    where: { storeId: Number(storeId) },
                    include: {
                        store: true,
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
                            message: '메뉴 조회를 실패하였습니다.',
                        },
                    })
                }
                break
            } else if (menuId != undefined) {
                const readResult = await prisma.menu.findUnique({
                    where: { id: Number(menuId) },
                    include: {
                        store: true,
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
                            message: '메뉴 조회를 실패하였습니다.',
                        },
                    })
                }
                break
            }
        // CREATE (메뉴 등록)
        case 'POST':
            if (inputMenu == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '메뉴 정보를 입력해주세요.',
                    },
                })
            } else {
                const createResult = await prisma.menu.create({
                    // 메뉴 정보들 + 해당 매장
                    data: { ...inputMenu, store: { connect: { id: store.id } } },
                    include: {
                        store: true,
                    },
                })

                if (createResult != null) {
                    // 성공!!
                    res.status(200).json(createResult)
                } else {
                    // 결과 값이 없을때 오류
                    res.status(400).json({
                        message: '메뉴를 등록할 수 없습니다.',
                    })
                }
                break
            }

        case 'PUT':
            if (menu == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '수정 할 메뉴 정보를 입력해주세요.',
                    },
                })
            } else {
                await prisma.menu.update({
                    where: {
                        id: menu.id,
                    },
                    data: { name: menu.name, description: menu.description, image: menu.image, price: menu.price },
                })

                res.status(200).json({
                    data: { success: true },
                })
                break
            }

        // DELETE (menuId에 해당되는 메뉴 삭제)
        case 'DELETE':
            if (menu == null || menu == undefined) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '삭제 할 값은 필수입니다.',
                    },
                })
                return
            }

            const deleteResult = await prisma.menu.delete({
                where: { id: menu.id },
            })

            if (deleteResult != null) {
                // 삭제 성공!!
                res.status(200).json(deleteResult)
            } else {
                // 삭제 실패.
                res.status(400).json({
                    error: {
                        code: 400,
                        message: '해당 메뉴를 삭제할 수 없습니다.',
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
