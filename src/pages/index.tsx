import Head from 'next/head'
import { Button, Grid, Input, Spacer, Text } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import ReviewCard from '@/components/reviewCard'
import { HiSearch } from 'react-icons/hi'
import { Prisma } from '@prisma/client'
import { GetServerSideProps } from 'next/types'
import { Key } from 'react'

interface reviewProps {
    // review에 연결된 order에서 store,user,orderDetail을 다시 orderDetail에서 menu정보를 불러온다
    // 결론: review에 연결된 모든 테이블 조회 가능
    // + 나중에 타입들 모아서 라이브러리화 생각 중.
    review: Prisma.ReviewGetPayload<{
        include: { 
            order: {
                include: {
                    store: true,
                    user: true, 
                    orderDetail: {
                        include: {menu: true}
                    }
                }
            }
        }   
    }>
}

export default function Home ( { review }: reviewProps ) {
    const session = useSession()
    const router = useRouter()

    console.log(review)

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
                    {(review as unknown as reviewProps[])?.map((item: reviewProps, index: Key) => (
                        <Grid xs={12} sm={6} lg={4} key={index}>
                            {/*props 2개 인 이유는 review의 기본컬럼이랑 연결된 테이블들을 따로 인식돼서 2개 다 주었음*/}
                            {<ReviewCard {...item.review} {...item} />}
                        </Grid>
                    ))}
                </Grid.Container>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {

    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews`, { method: "GET" })
    const review = await result.json().then(data => data as reviewProps) // any to reviewProps

    return {
        props: { review } 
    }
}
