import { NextApiRequest, NextApiResponse } from 'next'
import { requestVerificationCode } from '@/libs/smsAuth'

export interface SMSRequestAPIRequest extends NextApiRequest {
    body: {
        phoneNumber: string
    }
}

export default async (req: SMSRequestAPIRequest, res: NextApiResponse) => {
    const phoneNumber = req.body.phoneNumber

    if (!phoneNumber) {
        res.status(400).json({
            error: {
                code: 400,
                message: "휴대폰 번호는 필수 값입니다."
            }
        })
        return
    }

    const verificationCode = await requestVerificationCode(phoneNumber)

    res.status(200).json({
        data: {
            verificationCode: verificationCode
        }
    })
}
