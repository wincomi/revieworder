import Layout from '@/components/layout'
import { Text } from '@nextui-org/react'
import { GetServerSideProps } from 'next/types'

import { ReviewAPIGETResponse, ReviewItem } from '../api/reviews'
import ReviewCard from '@/components/index/reviewCard'
import { useState } from 'react'

interface StorePageProps {
    reviewItem: ReviewItem
}

export default ({ reviewItem }: StorePageProps) => {
    const [query, setQuery] = useState('')
    // warning 떠서 임시로
    console.log(query)

    return (
        <Layout>
            <Text h3>리뷰 정보</Text>
            <ReviewCard review={reviewItem} onChangeQuery={(data) => setQuery(data)} />
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 검색 쿼리
    const reviewId = context.query.review_id

    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews?reviewId=${reviewId}`, { method: 'GET' })
    const response = await result.json().then((data) => data as ReviewAPIGETResponse)

    const reviewItem = response.data

    return {
        props: { reviewItem },
    }
}
