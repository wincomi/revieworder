import Head from 'next/head'
import { Button, Grid, Input, Spacer, Text } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import ReviewCard, { ReviewCardProps } from '@/components/reviewCard'
import { HiSearch } from 'react-icons/hi'
import { Prisma } from '@prisma/client'
import { GetServerSideProps } from 'next/types'
import { Key } from 'react'

interface ReviewProps {
    reviewCards: ReviewCardProps[]
}

export default function Home ( { reviewCards }: ReviewProps ) {
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
                    {reviewCards.map((item: ReviewCardProps, index: Key) => (
                        <Grid xs={12} sm={6} lg={4}>
                            <ReviewCard {...item} key={index} />
                        </Grid>
                    ))}
                </Grid.Container>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews`, { method: "GET" })
    const reviewCards = await result.json().then(data => data as ReviewCardProps) // any to ReviewCardProps

    return {
        props: { reviewCards } 
    }
}
