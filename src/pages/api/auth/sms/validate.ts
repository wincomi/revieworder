// 이 파일은 현재 사용하지 않음.
// libs/nextauth/phoneNumberProvider.ts 사용할 것

import { validateVerificationCode } from "@/libs/smsAuth"
import { NextApiRequest, NextApiResponse } from "next"

export interface SMSValidationAPIRequest extends NextApiRequest {
    body: {
        phoneNumber: string
        verificationCode: string
    }
}

export default async (req: SMSValidationAPIRequest, res: NextApiResponse) => {
    const { phoneNumber, verificationCode } = req.body

    if (!phoneNumber || !verificationCode) {
        res.status(400).json({
            error: {
                code: 400,
                message: "휴대폰 번호와 인증 코드는 필수 값입니다.",
            },
        })
        return
    }

    const result: boolean = await validateVerificationCode(
        phoneNumber,
        verificationCode
    )

    if (result == true) {
        res.status(200).json({
            data: {
                phoneNumber: phoneNumber,
                verificationCode: verificationCode,
            },
        })
    } else {
        res.status(400).json({
            error: {
                code: 400,
                message: "인증번호가 일치하지 않습니다.",
            },
        })
    }
}
