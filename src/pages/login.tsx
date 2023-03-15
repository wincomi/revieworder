import { getProviders, signIn } from 'next-auth/react'
import { Button, Text, Spacer } from '@nextui-org/react'
import { GetServerSideProps } from 'next'
import { SiApple, SiNaver, SiKakaotalk, SiFacebook } from 'react-icons/si'
import Layout from '@/components/layout'

// interface SignInPage {
//     providers: any
// }

export default (/* { providers }: SignInPage */) => {
    // TODO: 로그인되어 있을 경우 return (getSession() 사용)
    return (
        <Layout>
            <Text h2 css={{textAlign: 'center'}}>로그인</Text>
            <Button flat color="secondary" size="lg" onPress={() => signIn("apple")} icon={<SiApple />} css={{mx: 'auto'}}>
                Apple 로그인
            </Button>
            <Spacer />
            <Button flat color="warning" size="lg" onPress={() => signIn("kakao")} icon={<SiKakaotalk />} css={{mx: 'auto'}}>
                카카오 로그인
            </Button>
            <Spacer />
            <Button flat color="success" size="lg" onPress={() => signIn("naver")} icon={<SiNaver />} css={{mx: 'auto'}}>
                네이버 로그인
            </Button>
            <Spacer />
            <Button flat color="primary" size="lg" onPress={() => signIn("naver")} icon={<SiFacebook />} css={{mx: 'auto'}}>
                페이스북 로그인
            </Button>
        </Layout>
    )
}
  
// export const getServerSideProps: GetServerSideProps = async (context) => {
//     return {
//         props: {
//             providers: await getProviders()
//         }
//     }
// }
