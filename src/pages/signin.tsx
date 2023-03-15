import { getProviders, signIn } from 'next-auth/react'
import { Button, Spacer } from '@nextui-org/react'
import { GetServerSideProps } from 'next'

// interface SignInPage {
//     providers: any
// }

export default (/* { providers }: SignInPage */) => {
    // TODO: 로그인되어 있을 경우 return (getSession() 사용)
    return (
        <>
            <Button flat onPress={() => signIn("apple")}>
                Apple 로그인
            </Button>
            <Spacer />
            <Button flat color="warning" onPress={() => signIn("kakao")}>
                카카오 로그인
            </Button>
        </>
    )
}
  
// export const getServerSideProps: GetServerSideProps = async (context) => {
//     return {
//         props: {
//             providers: await getProviders()
//         }
//     }
// }
