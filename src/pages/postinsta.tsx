import Layout from "@/components/layout"
import { Text } from '@nextui-org/react'
import React from "react";
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { useSession} from "next-auth/react";
import { GetServerSideProps } from 'next/types'
import getUserNode from '@/libs/insta'


export default function postinsta() {
    
    return (
        <Layout>
            <Text h1>postinata</Text>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ( context ) => {
    const session = await getServerSession(context.req, context.res, authOptions)
    if(!session) { //session 에러 처리

    }
    let userId = session?.user.id
    //user의 instagram account 를 받아옴
    const account = await getUserNode(userId)
    //로그인 안했을때 오류뜨는것도 수정해야됨 ㅇㅇ
    const providerId = account?.providerAccountId
    const token = account?.access_token
    return {
        props: {
        }
    }
}
