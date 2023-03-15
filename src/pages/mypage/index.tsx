import Head from 'next/head'
import { signOut, useSession } from 'next-auth/react'
import { Button, Text, Loading, Spacer, Input, useInput, Grid, Switch } from "@nextui-org/react"
import Layout from '@/components/layout'

export default () => {
    const { data } = useSession({required: true})

    if (data?.user == null) return

    return (
        <>
            <Head>
                <title>마이페이지</title>
            </Head>
            <Layout>
                <Text h1>회원정보 변경</Text>
                <Input 
                    type="text"
                    label="이름"
                    placeholder="이름을 입력하세요."
                    initialValue={data.user.name ?? undefined} 
                    shadow={false}
                    fullWidth={true}
                    helperText="주문 혹은 리뷰 작성시 나타나는 이름을 입력하세요."
                    />
                <Spacer y={2} />
                <Input 
                    type="email" 
                    label="이메일"
                    placeholder="example@naver.com" 
                    initialValue={data.user.email ?? undefined} 
                    shadow={false}
                    fullWidth={true}
                    />
                <Spacer y={2} />
                <Input 
                    type="tel" 
                    label="전화번호"
                    placeholder="010-0000-0000" 
                    initialValue={undefined} 
                    shadow={false}
                    fullWidth={true}
                    />
                <Spacer y={2} />
                <Button auto flat onClick={() => signOut()} css={{ml: 'auto'}}>로그아웃</Button>
            </Layout>
        </>
    )
}
