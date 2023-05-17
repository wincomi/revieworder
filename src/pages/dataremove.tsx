import Layout from '@/components/layout'
import { Text } from '@nextui-org/react'

export default function dataRemovalPage() {
    return (
        <Layout>
            <Text h1>데이터 삭제 요청 방법</Text>
            <Text h2>1. 개인정보 보호 담당자에게 연락하여 삭제 요청</Text>
            <Text> 담당자:최진호 E-mail:crescent3es@gmail.com</Text>
            <Text>
                요청 예시:안녕하세요, 리뷰오더 서비스의 데이터 삭제를 요청드립니다. 번호:010-xxxx-xxxx,
                email:example@example.com
            </Text>
        </Layout>
    )
}
