import { getProviders, signIn, getCsrfToken } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'

import React from 'react'
import Head from 'next/head'
import Layout from '@/components/layout'
import { Button, Text, Spacer, Grid, Card, Input, useInput } from '@nextui-org/react'
import { SiApple, SiNaver, SiKakaotalk, SiFacebook, SiInstagram, SiTwitter } from 'react-icons/si'
import { FaCommentAlt, FaExclamationTriangle, FaLock, FaPaperPlane, FaSignInAlt } from 'react-icons/fa'
import { regexPhoneNumber } from '@/utils/regex'
import { useRouter } from 'next/router'

interface SignInPage {
    providers: string[],
    csrfToken: string
}

export default (props: SignInPage) => {
    const errorTexts: {[key: string]: string} = {
        Signin: "Try signing in with a different account.",
        OAuthSignin: "Try signing in with a different account.",
        OAuthCallback: "Try signing in with a different account.",
        OAuthCreateAccount: "Try signing in with a different account.",
        EmailCreateAccount: "Try signing in with a different account.",
        Callback: "Try signing in with a different account.",
        OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
        EmailSignin: "The e-mail could not be sent.",
        CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
        SessionRequired: "Please sign in to access this page.",
        default: "Unable to sign in."
    }

    const router = useRouter()
    const error = router.query.error as string

    const { value: phoneNumber, bindings: bindingsPhoneNumber } = useInput('')
    const { value: verificationCode, bindings: bindingsVerificationCode } = useInput('')

    type HelperMemoType = {
        text?: string,
        color?: "default" | "primary" | "secondary" | "success" | "warning" | "error"
    }
    
    // @ts-ignore: 타입스크립트 에러 무시
    const phoneNumberHelper = React.useMemo<HelperType>(() => {
        if (!phoneNumber)
          return { text: "", color: "" }

        const isValid = phoneNumber.match(regexPhoneNumber)

        return {
          text: !isValid && "올바른 휴대폰 번호를 입력하세요.",
          color: isValid ? "success" : "error"
        }
      }, [ phoneNumber ])
      
    /// 휴대폰 번호로 로그인
    const loginByPhoneNumber = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await signIn("phonenumber", {
            phoneNumber: phoneNumber,
            verificationCode: verificationCode,
            // callback: false는 사용할 수 없음 (이메일만 가능)
        })
    }

    return (
        <>
            <Head>
                <title>로그인</title>
            </Head>
            <Layout>
                {error &&
                    <Card css={{$$cardColor: '$colors$error' }}>
                        <Card.Body>
                            <Text h6 size={15} color="white" css={{ m: 0, ta: 'center' }}>
                                <FaExclamationTriangle style={{ verticalAlign: 'text-bottom' }} />{errorTexts[error]}
                            </Text>
                        </Card.Body>
                    </Card>
                }
                <Grid.Container gap={4}>
                    <Grid xs={12} md={6} alignItems="baseline">
                        <Card variant="flat" css={{ maxWidth: 300, ml: 'auto' }}>
                            <Card.Body css={{ta: 'center'}}>
                                <form onSubmit={loginByPhoneNumber}>
                                    <Text h3>휴대폰 번호로 로그인</Text>
                                    <Input 
                                        {...bindingsPhoneNumber}
                                        color={phoneNumberHelper.color}
                                        helperColor={phoneNumberHelper.color}
                                        helperText={phoneNumberHelper.text}
                                        name="phoneNumber"
                                        type="tel" 
                                        placeholder='010-0000-0000'
                                        shadow={false}
                                        fullWidth={true}
                                        underlined
                                        labelLeft={<FaCommentAlt />}
                                    />
                                    <Spacer />
                                    <Button color="primary" size="sm" flat icon={<FaPaperPlane />} css={{ width: '100%' }}>인증번호 발송</Button>
                                    <Spacer />
                                    <Input 
                                        {...bindingsVerificationCode}
                                        name="verificationCode"
                                        type="number" 
                                        placeholder='인증번호 6자리'
                                        shadow={false}
                                        fullWidth={true}
                                        underlined
                                        labelLeft={<FaLock />}
                                    />
                                    <Spacer />
                                    <Button type="submit" color="primary" size="sm" icon={<FaSignInAlt />} css={{width: '100%'}} disabled={(phoneNumber.length * verificationCode.length) == 0}>로그인</Button>
                                </form>
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
