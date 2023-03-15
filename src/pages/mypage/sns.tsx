import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { Button, Text, Spacer, Input, useInput, Grid, Switch } from "@nextui-org/react"
import Layout from '@/components/layout'

export default () => {
    const session = useSession({required: true})

    return (
        <>
            <Head>
                <title>SNS 연동</title>
            </Head>
            <Layout>
                <Text h1>SNS 연동</Text>
                <Grid.Container alignItems="center">
                    <Grid>
                        <Text h2>카카오</Text>
                    </Grid>
                    <Grid css={{ml: 'auto'}}>
                        <Button auto flat color="warning">연동</Button>
                    </Grid>
                </Grid.Container>
                <Grid.Container alignItems="center">
                    <Grid>
                        <Text h2>네이버</Text>
                    </Grid>
                    <Grid css={{ml: 'auto'}}>
                        <Button auto flat color="success">연동</Button>
                    </Grid>
                </Grid.Container>
                <Grid.Container alignItems="center">
                    <Grid>
                        <Text h2>인스타그램</Text>
                    </Grid>
                    <Grid css={{ml: 'auto'}}>
                        <Grid.Container alignItems="center" gap={1}>
                           <Grid><Text b>리뷰 자동 등록</Text></Grid>
                           <Grid><Switch /></Grid>
                        </Grid.Container>
                    </Grid>
                    <Spacer />
                    <Grid>
                        <Button auto flat color="error" css={{ml: 'auto'}}>연동</Button>
                    </Grid>
                </Grid.Container>
                <Grid.Container alignItems="center">
                    <Grid>
                        <Text h2>페이스북</Text>
                    </Grid>
                    <Grid css={{ml: 'auto'}}>
                        <Grid.Container alignItems="center" gap={1}>
                           <Grid><Text b>리뷰 자동 등록</Text></Grid>
                           <Grid><Switch /></Grid>
                        </Grid.Container>
                    </Grid>
                    <Spacer />
                    <Grid>
                        <Button auto flat color="secondary" css={{ml: 'auto'}}>연동</Button>
                    </Grid>
                </Grid.Container>
                <Grid.Container alignItems="center">
                    <Grid>
                        <Text h2>트위터</Text>
                    </Grid>
                    <Grid css={{ml: 'auto'}}>
                        <Grid.Container alignItems="center" gap={1}>
                           <Grid><Text b>리뷰 자동 등록</Text></Grid>
                           <Grid><Switch /></Grid>
                        </Grid.Container>
                    </Grid>
                    <Spacer />
                    <Grid>
                        <Button auto flat color="primary" css={{ml: 'auto'}}>연동</Button>
                    </Grid>
                </Grid.Container>
            </Layout>
        </>
    )
}
