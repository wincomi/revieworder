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
import { ReviewIdAPIGETResponse } from './api/reviews/post'

interface ReviewPageProps {
    revi: number
    reviewCards: ReviewItem[]
}

export default function Home({ revi, reviewCards }: ReviewPageProps) {
    useSession()
    const router = useRouter()

    console.log(revi)

    const [query, setQuery] = useState('')

    const exeSearch = () => {
        router.push(`/?search=${query}`)
    }

    const sumbit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        exeSearch()
    }

    return (
        <>
            <Head>
                <title>리뷰오더</title>
            </Head>
            <Layout>
                <Text h1>둘러보기</Text>
                <form onSubmit={sumbit}>
                    <Grid.Container justify="flex-start" css={{ mb: '$8' }}>
                        <Grid>
                            <Input
                                size="xl"
                                shadow={false}
                                clearable
                                placeholder="검색"
                                initialValue={query}
                                contentLeft={<HiSearch />}
                                fullWidth={true}
                                onChange={(e) => setQuery(e.currentTarget.value)}
                            />
                        </Grid>
                        <Grid css={{ ml: '$4' }}>
                            <Button auto flat css={{ h: '100%' }} icon={<HiSearch />} onPress={exeSearch}>
                                검색
                            </Button>
                        </Grid>
                    </Grid.Container>
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

    // post 사용 예시 다 보고 다시 지우삼
    const r = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews/post`, { method: 'GET' })
    const re = await r.json().then((data) => data as ReviewIdAPIGETResponse)

    const revi = re.data.id

    return {
        props: { revi, reviewCards },
    }
}
