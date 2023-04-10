import { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/libs/prismadb"
import { User } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

// 모든 유저 조회 제거, 모든 유저 삭제 제거

// API Request 타입 지정
export interface UserAPIRequest extends NextApiRequest {
    body: {
        /// 현재 세션의 유저 정보
        // 수정, 삭제 같은 경우 다른 정보도 받아와야해서 셰션 대신 타입 지정 
        user?: User,
    }
}

export type UserAPIGETResponse = {
    // TODO: password 컬럼도 포함되어 있음
    data: User
}

// 모든 유저 조회 및 등록 API
export default async (req: UserAPIRequest, res: NextApiResponse) => {
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
    const user = req.body.user

    // API method에 따라 작동
    switch (req.method) {

        // GET (셰션 내 유저 정보 조회)
        case "GET":
            
            const readResult = await prisma.user.findUnique({where: { id : userId }})

            if (readResult != null) {
                // 성공!!
                res.status(200).json({
                    data: readResult
                })
            } else {
                res.status(404).json({
                    error: {
                        code: 400,
                        message: "유저 정보 조회를 실패하였습니다."
                    }
                })
            }
            break


        // CREATE (sns 연동 외 회원가입)
        case "POST":

            if (user == undefined || user == null) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "user 값은 필수입니다."
                    }
                })
                return
            }

            const createResult = await prisma.user.create({
                // 유저 이름, 이메일, 비밀번호, 전화번호, 프로필 사진, 이메일 인증 시간?
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    phoneNumber: user.phoneNumber,
                    image: user.image,
                    emailVerified: user.emailVerified,
                }
            })

            if (createResult != null) {
                // 성공!!
                res.status(200).json({
                    data: createResult
                })
            } else {
                // 결과 값이 없을때 오류
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "유저를 등록할 수 없습니다."
                    }
                })
            }
            break

        // PUT (userId에 해당되는 유저 정보 수정)
        case "PUT":
        
            if (user == undefined || user == null) {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "user 값은 필수입니다."
                    }
                })
                return
            }

            const putResult = await prisma.user.update({
                where: { id: userId },
                // 유저 이름, 주소, 전화번호, 프로필 사진
                data: {
                    // null : no value, undefined : do nothing => 변경사항 없으면 변경X
                    name: user.name ?? undefined,
                    email: user.email ?? undefined, 
                    password: user.password ?? undefined, 
                    phoneNumber: user.phoneNumber ?? undefined, 
                    image: user.image ?? undefined, 
                    emailVerified: user.emailVerified ?? undefined ,
                    allergy: user.allergy ?? undefined
                }
            })

            if (putResult != null) {
                res.status(200).json({
                    data: putResult
                })
            } else {
                // 수정 실패.
                res.status(404).json({
                    error: {
                        code: 400,
                        message: "해당 유저를 수정할 수 없습니다."
                    }
                })
            }

            // TODO: 나중에 money 관련은 다른 페이지에 있는 API 여기서 user정보만 받거나? 셰션 사용해서 fetch 해볼 예정. 이중 fetch 되려나?

            break

        // DELETE (userId에 해당되는 유저 탈퇴)
        case "DELETE":
            const deleteResult = await prisma.user.delete({ where: { id: userId }})

            res.status(200).json({ 
                data: deleteResult 
            })

            break

        default:
            // API method가 잘못되었을 때 오류
            res.status(400).json({ 
                error: {
                    code: 400,
                    message: "잘못된 요청입니다."
                }
            })
    }
}
