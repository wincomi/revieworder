import Layout from "@/components/layout"
import { Button, Text } from '@nextui-org/react'
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { HiPencil } from "react-icons/hi"

export default () => {
    const router = useRouter()

    return (
        <Layout>
            <Text h1>내 프로필</Text>
            <Button flat onPress={() => router.push('/profile/edit') } css={{ml: 'auto'}} icon={<HiPencil />}>회원정보 수정</Button>
        </Layout>
    )
}
