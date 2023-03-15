import Head from 'next/head'
import { Container, Button, User, Loading, Spacer } from '@nextui-org/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'

export default function Home() {
    const session = useSession()
    const router = useRouter()

    return (
        <>
            <Head>
                <title>리뷰오더</title>
            </Head>
            <Layout>
                TODO
            </Layout>
        </>
    )
}
