import { NextApiRequest, NextApiResponse } from "next"
import prisma from "@/libs/prismadb"

// res.status(200) - 성공!, res.status(400) - 실패!

// menuId 쿼리를 받아와서 그 Id에 해당하는 메뉴 조회, 수정, 삭제 API
export default async (req: NextApiRequest, res: NextApiResponse) => {
    // number 타입 ( query : api/menus/1 )
    const menuId: number | null = (Number(req.query.menuId) as number) ?? null

    // API method에 따라 작동
    switch (req.method) {
        // READ (menuId에 해당하는 메뉴 정보 조회)
        case "GET":
            const readResult = await prisma.menu.findUnique({
                where: { id: menuId },
            })

            if (readResult != null) {
                // 성공!!
                res.status(200).json(readResult)
            } else {
                res.status(400).json({
                    message: "해당 메뉴 정보가 없습니다.",
                })
            }
            break

        // PUT (meunId에 해당되는 메뉴 정보 수정)
        case "PUT":
            const putResult = await prisma.menu.update({
                where: { id: menuId },
                // 유저 이름, 주소, 전화번호, 프로필 사진
                data: {
                    // null : no value, undefined : do nothing => 변경사항 없으면 변경X
                    name: req.body.name != null ? req.body.name : undefined,
                    description:
                        req.body.description != null
                            ? req.body.description
                            : undefined,
                    price: req.body.price != null ? req.body.price : undefined,
                    image: req.body.image != null ? req.body.image : undefined,
                    status:
                        req.body.status != null ? req.body.status : undefined,
                },
            })

            if (putResult != null) {
                // 성공!!
                res.status(200).json(putResult)
            } else {
                // 수정 실패.
                res.status(400).json({
                    message: "해당 메뉴를 수정할 수 없습니다.",
                })
            }
            break

        // DELETE (menuId에 해당되는 메뉴 삭제)
        case "DELETE":
            const deleteResult = await prisma.menu.delete({
                where: { id: menuId },
            })

            if (deleteResult != null) {
                // 삭제 성공!!
                res.status(200).json(deleteResult)
            } else {
                // 삭제 실패.
                res.status(400).json({
                    message: "해당 메뉴를 삭제할 수 없습니다.",
                })
            }
            break
    }
}
