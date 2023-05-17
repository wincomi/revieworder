import Layout from '@/components/layout'
import { Text } from '@nextui-org/react'

export default () => (
    <Layout>
        <Text h1>데이터 삭제 요청 방법</Text>
        <Text h2>개인정보 보호 담당자에게 연락하여 삭제 요청</Text>
        <Text>담당자 이메일(crescent3es@gmail.com)로 아래 내용과 같이 보내주세요.</Text>
        <Text h3>이메일 내용 예시</Text>
        <Text>
            안녕하세요, 리뷰오더 서비스의 데이터 삭제를 요청드립니다.
            <br />
            번호: 010-xxxx-xxxx
            <br />
            이메일: example@example.com
            <br />
        </Text>
    </Layout>
)
