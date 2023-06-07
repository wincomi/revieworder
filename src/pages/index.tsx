import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import ReviewCard from '@/components/index/reviewCard'
import { GetServerSideProps } from 'next/types'
import { useState } from 'react'

import Head from 'next/head'
import Layout from '@/components/layout'
import { Button, Grid, Input, Text } from '@nextui-org/react'
import { HiSearch } from 'react-icons/hi'
import { ReviewAPIGETResponse, ReviewItem } from './api/reviews'

interface ReviewPageProps {
    revi: number
    reviewCards: ReviewItem[]
}

export default function Home({ reviewCards }: ReviewPageProps) {
    const router = useRouter()

    const [query, setQuery] = useState('')

    const sumbit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.push(`/?search=${query}`)
    }

    return (
        <>
            <Head>
                <title>리뷰오더</title>
            </Head>
            <Layout>
                <Text h1>둘러보기</Text>
                <form onSubmit={sumbit}>
                    <Input
                        size="xl"
                        shadow={false}
                        clearable
                        placeholder="리뷰 검색"
                        initialValue={query}
                        contentLeft={<HiSearch />}
                        fullWidth={true}
                        onChange={(e) => setQuery(e.currentTarget.value)}
                    />
                </form>
                <Grid.Container gap={2} alignItems="stretch" css={{ px: 0 }}>
                    {reviewCards.map((item: ReviewItem) => (
                        <Grid xs={12} sm={6} lg={4} key={item.id}>
                            <ReviewCard review={item} onChangeQuery={(data) => setQuery(data)} />
                        </Grid>
                    ))}
                </Grid.Container>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 검색 쿼리
    const search = context.query.search ?? ''

    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews?q=${search}`, { method: 'GET' })
    const response = await result.json().then((data) => data as ReviewAPIGETResponse) // any to ReviewCardProps

    const reviewCards = response.data

    return {
        props: { reviewCards },
    }
}
