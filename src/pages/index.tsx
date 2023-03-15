import Head from 'next/head'
import { Button, Grid, Input, Spacer, Text } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import ReviewCard from '@/components/reviewCard'
import { HiSearch } from 'react-icons/hi'

export default function Home() {
    const session = useSession()
    const router = useRouter()

    function SearchInput() {
        return (
            <Input
                size="xl" 
                shadow={false} 
                clearable
                placeholder="검색"
                contentLeft={<HiSearch />}
                fullWidth={true}
            />
        )
    }

    const list = [1, 2, 3, 4, 5] // Sample Data

    return (
        <>
            <Head>
                <title>리뷰오더</title>
            </Head>
            <Layout>
                <Text h1>둘러보기</Text>
                <Grid.Container justify="flex-start" css={{mb: '$8'}}>
                    <Grid>{SearchInput()}</Grid>
                    <Grid css={{ml: '$4'}}><Button auto flat css={{h: '100%'}} icon={<HiSearch />}>검색</Button></Grid>
                </Grid.Container>
                <Grid.Container gap={2} justify="flex-start" css={{px: 0}}>
                    {list.map((item, index) => (
                        <Grid xs={12} sm={6} lg={4} key={index}>
                            <ReviewCard />
                        </Grid>
                    ))}
                </Grid.Container>
            </Layout>
        </>
    )
}
