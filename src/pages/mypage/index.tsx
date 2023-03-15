import Head from 'next/head'
import { signOut, useSession } from 'next-auth/react'
import { Button, Text, Spacer, Input, Card } from "@nextui-org/react"
import Layout from '@/components/layout'
import { TbPigMoney } from 'react-icons/tb'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'
import { User } from '@prisma/client'
import { getAccountProviders } from '@/libs/users'
import { FaPencilAlt } from 'react-icons/fa'

interface MyPageProps {
    /// 현재 세션의 유저 정보
    user?: User,

    /// 연결된 SNS 계정 종류
    accountProviders?: string[]
}

export default ({ user, accountProviders }: MyPageProps) => {
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
                {accountProviders &&
                    <Card css={{mb: '$12', $$cardColor: '$colors$gradient' }}>
                        <Card.Body>
                            <Text b color="white">현재 계정이 {accountProviders[0].toLocaleUpperCase()}(으)로 연결되어있습니다.</Text>
                        </Card.Body>
                    </Card>
                }

                <Card variant="flat">
                    <Card.Body>
                        <Text b>리뷰오더 머니</Text>
                        <Text h3 css={{mb: 0}}>{user.money.toLocaleString()} 원</Text>
                        <Button flat auto color="warning" size="sm" css={{mt: 8, ml: 'auto'}} icon={<TbPigMoney />}>충전</Button>
                    </Card.Body>
                </Card>
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
                    initialValue={user.phoneNumber ?? undefined} 
                    shadow={false}
                    fullWidth={true}
                    onChange={autoHyphen}
                    />
                <Spacer y={2} />
                <Button auto flat onPress={() => signOut()} css={{ml: 'auto'}} icon={<FaPencilAlt />}>저장</Button>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<MyPageProps> = async ({ req, res }) => {
    // getServerSideProps에서 getSession이 작동 안 되기에 getServerSession 사용
    const session = await getServerSession(req, res, authOptions)
  
    const userId = session?.user.id

    if (userId == undefined) {
        return { props: { } }
    }

    const accountProviders = await getAccountProviders(userId)
    
    const result = await fetch(`https://revieworder.kr:3000/api/users/${userId}`)
    const user = await result.json().then(data => data as User) // any to User

    return {
        props: { 
            user: user, 
            accountProviders: accountProviders
        }
    }
}
