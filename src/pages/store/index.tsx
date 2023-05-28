import { useRouter } from 'next/router'

import { GetServerSideProps } from 'next/types'
import { useState } from 'react'

import Head from 'next/head'
import Layout from '@/components/layout'
import { Button, Grid, Input, Text } from '@nextui-org/react'
import { HiSearch } from 'react-icons/hi'
import { StoreAPIGETResponse } from '../api/admin/stores'
import { Store } from '@prisma/client'
import StoreCard from '@/components/store/storeCard'

interface ReviewPageProps {
    stores: Store[]
}

export default function Home({ stores }: ReviewPageProps) {
    const router = useRouter()

    const [query, setQuery] = useState('')

    const exeSearch = () => {
        router.push(`/store?search=${query}`)
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
                    {stores.map((item: Store) => (
                        <Grid xs={12} sm={6} lg={4} key={item.id}>
                            <StoreCard store={item} />
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

    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/stores?q=${search}`, { method: 'GET' })
    const response = await result.json().then((data) => data as StoreAPIGETResponse) // any to ReviewCardProps

    const stores = response.data

    return {
        props: { stores },
    }
}
