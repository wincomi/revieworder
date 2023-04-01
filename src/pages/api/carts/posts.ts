import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"
import { OrderDetail } from '@prisma/client'
import { getSession } from 'next-auth/react'

// res.status(200) - 성공!, res.status(400) - 실패!

// userId 토대로 장바구니 조회 및 장바구니 초기화
// + reviewCard에 주문내역에 따른 메뉴들을 장바구니로 추가 API
export default (async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession( {req} )
  
    const userId = session?.user.id
    const menu: OrderDetail[] | null = req.body.menu as OrderDetail[] ?? null 

    // // 세션 확인용
    // console.log(session)

    // API method에 따라 작동
    switch (req.method) {
        // READ (userId에 해당되는 내 장바구니 목록 조회)
        case "GET":
            const readResult = await prisma.cart.findMany({ 
                where: { user : {id: userId} },
                include: { 
                    menu: { include: {store: true} } 
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
            
            await prisma.cart.deleteMany({
                where: { user: {id: userId}}
            })

            await Promise.all( 
            menu.map(async (item)=>{ await(
                await prisma.cart.create({
                    data: {
                        count: item.count,
                        user: { connect: { id: userId }},
                        menu: { connect: { id: item.menuId }}
                    },
                    include: {
                        menu: true
                    }
                }))
            })   
            )

            break

        // DELETE (userId에 해당하는 장바구니 다 삭제 -> 초기화)
        case "DELETE":
            await prisma.cart.deleteMany({
                where: { user: {id: userId}}
            })
            break
    }
})
