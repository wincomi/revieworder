import { signOut, useSession } from 'next-auth/react'
import { Button, Text, Loading, Spacer, Input, useInput, Grid, Switch } from "@nextui-org/react"

export default () => {
    const session = useSession()
    const { value, reset, bindings } = useInput("")

    if (session.status == "loading") {
        return <Loading type="points-opacity" />
    } else {
        return (
            <>
                <Button auto flat onClick={() => signOut()}>로그아웃</Button>
                <Spacer />
                <Text h1>회원정보 변경</Text>
                <Input 
                    type="text"
                    label="이름"
                    placeholder="이름을 입력하세요."
                    initialValue={session.data?.user?.name ?? undefined} 
                    shadow={false}
                    fullWidth={true}
                    />
                <Spacer />
                <Input 
                    type="email" 
                    label="이메일"
                    placeholder="example@naver.com" 
                    initialValue={session.data?.user?.email ?? undefined} 
                    shadow={false}
                    fullWidth={true}
                    />
                <Spacer />
                <Input 
                    type="tel" 
                    label="전화번호"
                    placeholder="010-0000-0000" 
                    initialValue={undefined} 
                    shadow={false}
                    fullWidth={true}
                    />
                <Spacer />

                <Text h1>SNS 연동</Text>
                <Grid.Container gap={2}>
                    <Grid>
                        카카오
                        <Button flat auto>연동</Button>
                    </Grid>
                    <Grid>
                        네이버
                        <Button flat auto>연동</Button>
                    </Grid>
                    <Grid>
                        인스타그램
                        <Button flat auto>연동</Button>
                        리뷰 연동 <Switch />
                    </Grid>
                    <Grid>
                        페이스북
                        <Button flat auto>연동</Button>
                        리뷰 연동 <Switch />
                    </Grid>
                    <Grid>
                        트위터
                        <Button flat auto>연동</Button>
                        리뷰 연동 <Switch />
                    </Grid>
                </Grid.Container>
            </>
        )
    }
}
