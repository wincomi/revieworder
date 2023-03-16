import { getProviders, signIn, getCsrfToken } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'

import Head from 'next/head'
import Layout from '@/components/layout'
import { Button, Text, Spacer, Grid, Card, Input } from '@nextui-org/react'
import { SiApple, SiNaver, SiKakaotalk, SiFacebook, SiInstagram, SiTwitter } from 'react-icons/si'
import { FaCommentAlt, FaPaperPlane } from 'react-icons/fa'

interface SignInPage {
    providers: string[],
    csrfToken: string
}

export default (props: SignInPage) => {
    // TODO: 로그인되어 있을 경우 return (getSession() 사용)
    return (
        <>
            <Head>
                <title>로그인</title>
            </Head>
            <Layout>
                <Grid.Container gap={4}>
                    <Grid xs={12} md={6} alignItems="baseline">
                        <Card variant="flat" css={{ maxWidth: 300, ml: 'auto' }}>
                            <Card.Body css={{ta: 'center'}}>
                                <Text h3>휴대폰 번호로 로그인</Text>
                                <Input 
                                    type="tel" 
                                    placeholder='010-0000-0000'
                                    shadow={false}
                                    fullWidth={true}
                                    underlined
                                    labelLeft={<FaCommentAlt />}
                                   />
                                <Spacer />
                                <Button color="primary" size="sm" flat icon={<FaPaperPlane />}>인증번호 발송</Button>
                            </Card.Body>
                        </Card>
                    </Grid>
                    <Grid xs={12} md={6}>
                        <div style={{width: '100%'}}>
                            <Button color="primary" size="lg" onPress={() => signIn("facebook")} icon={<SiFacebook />} css={{mr: 'auto'}}>
                                페이스북으로 로그인
                            </Button>
                            <Spacer />
                            <Button color="error" size="lg" onPress={() => signIn("instagram")} icon={<SiInstagram />} css={{mr: 'auto'}}>
                                인스타그램으로 로그인
                            </Button>
                            <Spacer />
                            <Button color="primary" size="lg" onPress={() => signIn("twitter")} icon={<SiTwitter />} css={{mr: 'auto'}} disabled>
                                트위터로 로그인
                            </Button>
                            <Spacer />
                            <Button color="warning" size="lg" onPress={() => signIn("kakao")} icon={<SiKakaotalk />} css={{mr: 'auto'}}>
                                카카오로 로그인
                            </Button>
                            <Spacer />
                            <Button color="success" size="lg" onPress={() => signIn("naver")} icon={<SiNaver />} css={{mr: 'auto'}}>
                                네이버로 로그인
                            </Button>
                            <Spacer />
                            <Button color="secondary" size="lg" onPress={() => signIn("apple")} icon={<SiApple />} css={{mr: 'auto'}}>
                                Apple로 로그인
                            </Button>
                        </div>
                    </Grid>
                </Grid.Container>
            </Layout>
        </>
    )
}
  
export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    // 로그인되어 있을 경우 메인 페이지로 보냄
    if (session) {
        return {
            redirect: { 
                permanent: false,
                destination: "/" 
            },
            props: { }
        }
    }

    return {
        props: {
            providers: await getProviders(),
            csrfToken: await getCsrfToken(context)
        }
    }
}
