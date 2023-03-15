import Head from 'next/head'
import { signOut, useSession } from 'next-auth/react'
import { Button, Text, Loading, Spacer, Input, useInput, Grid, Switch } from "@nextui-org/react"
import Layout from '@/components/layout'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { InferGetServerSidePropsType } from 'next'

export default ({ item }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { data } = useSession({required: true})

    if (data?.user == null) return

    const autoHyphen = (e: { currentTarget: { value: string } }) => {
        e.currentTarget.value = e.currentTarget.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "")
    }

    return (
        <>
            <Head>
                <title>마이페이지</title>
            </Head>
            <Layout>
                <Text h1>회원정보 변경</Text>
                {JSON.stringify(data)}
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
                    label="휴대폰 번호"
                    placeholder='010-0000-0000'
                    initialValue={/*item.phoneNumber ?? */undefined} 
                    shadow={false}
                    fullWidth={true}
                    onChange={autoHyphen}
                    />
                <Spacer y={2} />
                <Button auto flat onClick={() => signOut()} css={{ml: 'auto'}}></Button>
            </Layout>
        </>
    )
}


export async function getServerSideProps({ req, res }) {
    var session = await getServerSession(req, res, authOptions)
  
    const userId = session?.user.id
    
    var res = await fetch(
      `https://revieworder.kr:3000/api/users/${userId}`
    )
    const item = await res.json()
    if (item == null) {
      console.log("값을 받아올 수 없습니다.")
    } else {
      return {
        props: { item },
      }
    }
  }
  
