import Layout from "@/components/layout"
import { getAccountProviders } from "@/libs/users"
import { Grid, Text } from '@nextui-org/react'
import { Prisma } from "@prisma/client"
import { GetServerSideProps } from "next"
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import { authOptions } from "./api/auth/[...nextauth]"

interface CartProps {
    cart: Prisma.CartGetPayload<{
        include: {
            menu: true
        }   
    }>
}

export default function Cart( {cart}: CartProps ) {
    const session = useSession()
    console.log(cart)
    return (
        <Layout>
            <Text h1>장바구니</Text>
                <Grid.Container gap={2} justify="flex-start" css={{px: 0}}>
                    {}
                </Grid.Container>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req,res}) => {
    // getServerSideProps에서 getSession이 작동 안 되기에 getServerSession 사용
    const session = await getServerSession(req, res, authOptions)
  
    const userId = session?.user.id

    if (userId == undefined) {
        return { props: { } }
    }
    
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/carts/posts/`,{
        method: "GET",
        headers: {
            // session의 쿠키 전달
            cookie: req.headers.cookie || "",
          }
    })
    const cart = await result.json().then(data => data as CartProps) 

    return {
        props: { 
           cart
        }
    }
}

