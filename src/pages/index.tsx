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
                {session.status == "loading" && <Loading />}
                    {(session.data?.user != null) &&
                        <User 
                            name={session.data.user.name} 
                            src={session.data.user.image ?? undefined} 
                            description={JSON.stringify(session)}
                            size="xl" 
                            zoomed
                        />
                    }
                    {session.status === "authenticated" ?
                        <Button flat onPress={() => signOut()}>로그아웃</Button> :
                        <Button flat onPress={() => signIn()}>로그인</Button>
                    }
                    <Spacer y={1} />
                    <Button color="gradient" onPress={() => router.push('/mypage')}>마이페이지</Button>
                    <Spacer y={100} />
            </Layout>
        </>
    )
}
