import Head from 'next/head'
import { Button, Text, Spacer, Input, Card } from "@nextui-org/react"
import Layout from '@/components/layout'
import { TbPigMoney } from 'react-icons/tb'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'
import { User } from '@prisma/client'
import { getAccountProviders } from '@/libs/users'
import { FaPencilAlt } from 'react-icons/fa'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface ProfileEditPageProps {
    /// 현재 세션의 유저 정보
    user?: User,

    /// 연결된 SNS 계정 종류
    accountProviders?: string[]
}

export default ({ user, accountProviders }: ProfileEditPageProps) => {
    // 로그인된 유저만 접근 가능
    const session = useSession({ required: true })

    // input 폼에서 바뀌는 value(값)들을 저장하는데 쓴다.
    const [update, setUpdate] = useState({
        name: '',
        email: '',
        tel: ''
      });

    // 개인정보 수정
    const edit = async () => {
        
        // 세션에서 유저 ID 받아온다.
        const userId = user?.id
        const result = await fetch(`https://revieworder.kr:3000/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // 보내줘야할 body.데이터들
                name: update.name,
                email: update.email,
                phoneNumber: update.tel,

                // 수정 안 해도 되는 것들
                //password: null,
                //image: null,
                //emailVerified: null
            })
        })
        // 새로고침 필요. (저번에 router 썻는데 이번엔?)
    }

    // 자동 하이픈 처리
    const autoHyphen = (e: { currentTarget: { value: string } }) => {
        e.currentTarget.value = e.currentTarget.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "")

            // 전화번호 value 값 저장 -- 124 주석 참고
            setUpdate({ ...update, tel: e.currentTarget.value })
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
                    name = "name"
                    label="이름"
                    placeholder="이름을 입력하세요."
                    initialValue={user.name ?? undefined} 
                    shadow={false}
                    fullWidth={true}
                    helperText="주문 혹은 리뷰 작성시 나타나는 이름을 입력하세요."
                    onChange={(e) => setUpdate({ ...update, name: e.target.value })}
                    />
                <Spacer y={2} />
                <Input 
                    type="email" 
                    label="이메일"
                    placeholder="example@naver.com" 
                    initialValue={user.email ?? undefined} 
                    shadow={false}
                    fullWidth={true}
                    onChange={(e) => setUpdate({ ...update, email: e.target.value })}
                    />
                <Spacer y={2} />
                <Input 
                    type="tel" 
                    label="휴대폰 번호"
                    placeholder='010-0000-0000'
                    initialValue={user.phoneNumber ?? undefined} 
                    shadow={false}
                    fullWidth={true}

                    // onChange에 이벤트 2개를 동시에 못해서 autoHyphen에서 value값 저장
                    onChange = {autoHyphen}
                    />
                <Spacer y={2} />
                <Button auto flat onPress={() => edit()} css={{ml: 'auto'}} icon={<FaPencilAlt />}>저장</Button>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<ProfileEditPageProps> = async ({ req, res }) => {
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
