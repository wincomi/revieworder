import Layout from '@/components/layout'
import { Button, Text } from '@nextui-org/react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'

interface StorePageParams extends ParsedUrlQuery {
    store_id?: string
}

interface StorePageProps {
    store_id: number
}

export default ({ store_id }: StorePageProps) => {
    return (
        <Layout>
            <Text h1>가게</Text>
            {store_id}번
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<StorePageProps, StorePageParams> = async ({ params }) => {
    return {
        props: { store_id: Number(params?.store_id) },
    }
}

export const getStaticPaths: GetStaticPaths<StorePageParams> = async () => {
    // { fallback: false } means other routes should 404
    return { paths: [], fallback: true }
}
