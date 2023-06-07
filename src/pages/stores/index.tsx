import { useRouter } from 'next/router'

import { GetServerSideProps } from 'next/types'
import { useState } from 'react'

import Head from 'next/head'
import Layout from '@/components/layout'
import { Button, Grid, Input, Text } from '@nextui-org/react'
import { HiSearch } from 'react-icons/hi'
import { StoreAPIGETResponse } from '../api/admin/stores'
import { Store } from '@prisma/client'
import StoreCard from '@/components/stores/storeCard'

interface StoreSearchPageProps {
    stores: Store[]
}

export default function Home({ stores }: StoreSearchPageProps) {
    const [query, setQuery] = useState('')

    const sumbit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.push(`/stores?search=${query}`)
    }

    return (
        <>
            <Head>
                <title>매장</title>
            </Head>
            <Layout>
                <Text h1>매장</Text>
                <form onSubmit={sumbit}>
                    <Input
                        size="xl"
                        shadow={false}
                        clearable
                        placeholder="매장 검색"
                        initialValue={query}
                        contentLeft={<HiSearch />}
                        fullWidth={true}
                        onChange={(e) => setQuery(e.currentTarget.value)}
                    />
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
