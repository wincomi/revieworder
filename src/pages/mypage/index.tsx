import Head from 'next/head'
import { signOut, useSession } from 'next-auth/react'
import { Button, Text, Spacer, Input, Grid } from "@nextui-org/react"
import Layout from '@/components/layout'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'
import { User } from '@prisma/client'

interface MyPageProps {
    user: User | undefined | null
}

export default ({ user }: MyPageProps) => {
    const autoHyphen = (e: { currentTarget: { value: string } }) => {
        e.currentTarget.value = e.currentTarget.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "")
    }

    if (user == null) {
        return <></>
    }

    return (
        <>
            <Head>
                <title>마이페이지</title>
            </Head>
            <Layout>
                <Text h1>회원정보 변경</Text>
                <pre>{JSON.stringify(user)}</pre>
                <Input 
                    type="text"
                    readOnly
                    label="리뷰오더 머니"
                    initialValue={user.money.toLocaleString()}
                    labelRight="원"
                    fullWidth={true}
                    style={{textAlign: 'right'}}
                    />
                <Button flat auto size="sm" css={{mt: 8, ml: 'auto'}}>충전</Button>
                <Spacer />
                <Input 
                    type="text"
                    label="이름"
                    placeholder="이름을 입력하세요."
                    initialValue={user.name ?? undefined} 
                    shadow={false}
                    fullWidth={true}
                    helperText="주문 혹은 리뷰 작성시 나타나는 이름을 입력하세요."
                    />
                <Spacer y={2} />
                <Input 
                    type="email" 
                    label="이메일"
                    placeholder="example@naver.com" 
                    initialValue={user.email ?? undefined} 
                    shadow={false}
                    fullWidth={true}
                    />
                <Spacer y={2} />
                <Input 
                    type="tel" 
                    label="휴대폰 번호"
                    placeholder='010-0000-0000'
                    initialValue={/*item.phoneNumber ?? */undefined} 
                    shadow={false}
                    fullWidth={true}
                    onChange={autoHyphen}
                    />
                <Spacer y={2} />
                <Button auto flat onPress={() => signOut()} css={{ml: 'auto'}}>저장</Button>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<MyPageProps> = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions)
  
    const userId = session?.user.id

    if (userId == undefined) {
        return {
            props: { user: null }
        }
    }
    
    const result = await fetch(`https://revieworder.kr:3000/api/users/${userId}`)
    const user = await result.json().then(data => data as User) // any to User

    return {
        props: { user: user }
    }
}
