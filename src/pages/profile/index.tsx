import Layout from "@/components/layout"
import { Button, Text } from '@nextui-org/react'
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { HiPencil } from "react-icons/hi"

export default () => {
    // 로그인된 유저만 접근 가능
    const session = useSession({ required: true })
    
    const router = useRouter()

    return (
        <Layout>
            <Text h1>내 프로필</Text>
            <Button flat onPress={() => router.push('/profile/edit') } css={{ml: 'auto'}} icon={<HiPencil />}>회원정보 수정</Button>
        </Layout>
    )
}
