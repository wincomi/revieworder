import Layout from '@/components/admin/layout'
import { Text } from '@nextui-org/react'
import { GetServerSideProps } from 'next/types'
import { StoreAPIGETResponse, StoreInfo } from '../api/stores'
import StoreSelection from '@/components/admin/storeSelection'

interface adminPageProps {
    selectedStore: StoreInfo
    storesInfo: StoreInfo[]
}

export default function adminPage({ selectedStore, storesInfo }: adminPageProps) {
    //console.log(storesInfo)

    if (storesInfo.length == 0) {
        return (
            <>
                <Layout>
                    <Text>홈</Text>
                    <Text>매장 만들기</Text>
                </Layout>
            </>
        )
    }

    return (
        <>
            <Layout>
                <Text h3>{selectedStore.name ?? '홈'}</Text>
                <StoreSelection stores={storesInfo} />
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 회원이 가지고 있는 매장들 정보
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/stores?id=`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const response = await result.json().then((data) => data as StoreAPIGETResponse)

    const storesInfo = response.data

    // 선택 된 매장 정보

    // 검색 쿼리
    const selectedStoreId = context.query.storeId ?? ''

    const selectedResult = await fetch(`${process.env.NEXTAUTH_URL}/api/stores?id=${selectedStoreId}`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const selectedRes = await selectedResult.json().then((data) => data as StoreAPIGETResponse)

    const selectedStore = selectedRes.data

    return {
        props: { selectedStore, storesInfo },
    }
}
