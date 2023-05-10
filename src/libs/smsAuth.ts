import prisma from '@/libs/prismadb'
import { sendSMS } from './ncp'

/// 휴대폰 번호 인증

/// 인증번호 생성
function createVerificationCode(): string {
    const verificationCode = Math.floor(Math.random() * (999999 - 100000)) + 100000
    return verificationCode.toString()
}

/// 인증번호 요청
// TODO: 3분이내 재요청 금지
export async function requestVerificationCode(phoneNumber: string) {
    // 인증번호가 있는지 확인 후 이미 있을 경우 삭제
    try {
        await prisma.verificationCode.delete({
            where: {
                phoneNumber: phoneNumber,
            },
        })
    } catch {}

    const verificationCode = createVerificationCode()
    console.log(`phoneNumber: ${phoneNumber}\nverificationCode: ${verificationCode}`)

    await prisma.verificationCode.create({
        data: {
            phoneNumber: phoneNumber,
            verificationCode: verificationCode,
        },
    })

    await sendSMS(phoneNumber, `[리뷰오더] 인증번호: [${verificationCode}]`)
}

/// 인증번호 비교 및 확인
export async function validateVerificationCode(phoneNumber: string, verificationCode: string): Promise<boolean> {
    const result = await prisma.verificationCode.findUnique({
        where: {
            phoneNumber: phoneNumber,
        },
    })

    if (!result) {
        return false
    }

    if (result.verificationCode == verificationCode) {
        // DB에서 인증코드 삭제
        await prisma.verificationCode.delete({
            where: {
                phoneNumber: phoneNumber,
            },
        })

        return true
    }

    return false
}
