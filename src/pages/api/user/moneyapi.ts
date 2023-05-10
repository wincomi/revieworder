import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import prisma from '@/libs/prismadb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    const userId = session?.user.id
    const setUserId = req.body.userId

    const money = req.body.money
    const opt = req.body.opt

    // 세션이 존재하는지 확인
    if (session == null) {
        res.status(401).json({
            error: {
                code: 401,
                message: '세션이 존재하지 않습니다.',
            },
        })
        return
    } else if (userId != setUserId) {
        res.status(401).json({
            error: {
                code: 401,
                message: '유저 정보 불일치.',
            },
        })
        return
    }

    const pointOpt = (readMoney: number) => {
        if (opt == 'pay') return readMoney - money
        else if (opt == 'charge') return readMoney + money
    }

    switch (req.method) {
        case 'PUT':
            const readMoney = await prisma.user.findUnique({
                where: { id: userId },
                select: { money: true },
            })

            if (readMoney != null) {
                const updateResult = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        money: pointOpt(readMoney.money),
                    },
                })

                if (updateResult != null) {
                    // 성공!!
                    res.status(200).json({
                        data: updateResult,
                    })
                } else {
                    res.status(404).json({
                        error: {
                            code: 400,
                            message: '머니 변경을 실패하였습니다.',
                        },
                    })
                }
            }
            break
    }
}
