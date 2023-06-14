import Layout from '@/components/layout'
import { Text } from '@nextui-org/react'
import { GetServerSideProps } from 'next/types'

import { ReviewAPIGETResponse, ReviewItem } from '../api/reviews'
import ReviewCard from '@/components/index/reviewCard'
import CommentCard from '@/components/index/CommentCard'
import { useState } from 'react'
import { User } from '@prisma/client'
import { UserAPIGETResponse, UserInfo } from '@/pages/api/user'

interface Comment {
    id: number
    reviewId: string
    text: string
    userId: string
    createTime: Date
}

interface StorePageProps {
    reviewItem: ReviewItem
    commentProps: Comment[]
    users: User[]
}

export default ({ reviewItem, commentProps, users }: StorePageProps) => {
    const [query, setQuery] = useState('')
    // warning 떠서 임시로
    console.log(query)

    return (
        <Layout>
            <Text h3>리뷰 정보</Text>
            <ReviewCard review={reviewItem} onChangeQuery={(data) => setQuery(data)} />
            <CommentCard commentProps={commentProps} users={users}></CommentCard>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 검색 쿼리
    const reviewId = context.query.review_id

    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews?reviewId=${reviewId}`, { method: 'GET' })
    const response = await result.json().then((data) => data as ReviewAPIGETResponse)
    const reviewItem = response.data
    let commentResponse
    try {
        commentResponse = await fetch(`http://localhost:3001/api/comment/1`, { method: 'GET' })
    } catch (error) {
        return {
            props: { reviewItem: reviewItem, commentProps: null, users: null },
        }
    }

    const commentResponseJson = await commentResponse.json().then((data) => data)
    const commentProps = commentResponseJson.data as Comment[]
    console.log(commentProps)
    // const getUsers = comments.map((comment: Comment) => {
    //     return fetch(`${process.env.NEXTAUTH_URL}/api/user?userId=${comment.userId}`, {
    //         method: 'GET',
    //         headers: {
    //             cookie: context.req.headers.cookie || '',
    //         },
    //     })
    // })
    const userRes = await fetch(`${process.env.NEXTAUTH_URL}/api/user?admin=true`, {
        method: 'GET',
        headers: {
            cookie: context.req.headers.cookie || '',
        },
    })

    const userResult = await userRes.json().then((data) => data as UserAPIGETResponse)
    const users = userResult.data

    console.log(users)

    return {
        props: { reviewItem: reviewItem, commentProps: commentProps, users: users },
    }
}
