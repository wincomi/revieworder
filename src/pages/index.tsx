import Head from 'next/head'
import Image from 'next/image'
import { Container, Button, User, Loading } from '@nextui-org/react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Home() {
    const session = useSession()

    return (
        <>
            <Head>
                <title>리뷰오더</title>
            </Head>
            <main>
                <Container css={{pt: 32}}>
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
                        <Button flat onClick={() => signOut()}>로그아웃</Button> :
                        <Button flat onClick={() => signIn()}>로그인</Button>
                    }
                </Container>
            </main>
        </>
    )
}
