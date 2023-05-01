import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from "@/libs/prismadb"
import { User } from '@prisma/client'
import { regexNumber, regexPhoneNumber } from '@/utils/regex'
import { validateVerificationCode } from '@/libs/smsAuth'

export default () => CredentialsProvider({
    id: "phonenumber",
    name: "phonenumber", // await signIn("phonenumber", { ... }) 으로 사용 가능
    credentials: {
        phoneNumber: { label: "휴대폰 번호", type: "text", placeholder: "010-0000-0000" },
        verificationCode: { label: "인증번호", type: "number", placeholder: "123456" }
    },
    authorize: async (credentials, req) => {
      // 휴대폰 번호와 인증번호가 전달되지 않을 경우 null 반환
      if (credentials?.phoneNumber == null || credentials.verificationCode == null) {
        return null
      }
  
      const phoneNumber = credentials.phoneNumber.replace(/-/g, "") // 휴대폰 번호 하이픈(-) 제거
      const { verificationCode }  = credentials
  
      // 휴대폰 번호 유효성 검사
      const isValidPhoneNumber = phoneNumber.match(regexPhoneNumber)
  
      // 인증번호 유효성 검사
      const isValidVerificationCode = verificationCode.match(regexNumber)
  
      if (!(isValidPhoneNumber && isValidVerificationCode)) {
        return null
      }

      // 유효성 검사 끝
    
      // 인증번호 확인
      const isValidated = await validateVerificationCode(phoneNumber, verificationCode)

      if (!isValidated) {
        return null
      }

      var user: User | null
      
      // 휴대폰 번호와 같은 유저 검색
      user = await prisma.user.findUnique({
        where: {
          phoneNumber: phoneNumber
        }
      })
  
      // 만약 유저가 없을 경우 가입
      if (user == null) {
        user = await prisma.user.create({ 
          data: { phoneNumber: phoneNumber }
        })
      }
  
      return user
    }
})
