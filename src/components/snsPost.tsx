import React, { Key, useState } from 'react'
import { postFacebookPage, postInstagramMedia } from '@/libs/sns'
import { Dropdown } from '@nextui-org/react'
import { Account } from '@prisma/client'
import { AiFillFacebook, AiFillInstagram } from 'react-icons/ai'
import router from 'next/router'

export type PostReviewPageProps = {
    content: string
    imageUrl: string
    account: Account
    reviewId: number
    pageId: string
}

/// TODO
/// 1. 디자인 수정
/// 2. 이미지URL, link 입력 추가
/// 3. SNS POST 버튼 선택으로 변경
export default ({ content, imageUrl, account, reviewId, pageId }: PostReviewPageProps) => {
    const [selectedSNS, setSelectedSNS] = useState('')

    const dropdownAction: (key: Key) => void = (key) => {
        setSelectedSNS(key as string)
        postReview(selectedSNS)
    }

    const postReview = async (provider: string) => {
        const link = `https://revieworder.kr/${reviewId}`
        if (provider == 'instagram') {
            const postId = await postInstagramMedia(account, content, imageUrl)
            if (postId == null) {
                console.log('오류 발생')
            }
            console.log(postId)
        } else if (provider == 'facebook') {
            const postId = await postFacebookPage(account, content, imageUrl, link, pageId)
            if (postId == null) {
                console.log('오류 발생')
            }
            console.log(postId)
            if (confirm('내 리뷰로 이동하시겠습니까?')) {
                router.push('/review')
            }
        }
    }

    return (
        <Dropdown>
            <Dropdown.Button flat color="secondary">
                SNS 업로드
            </Dropdown.Button>
            <Dropdown.Menu color="secondary" aria-label="Actions" selectionMode="single" onAction={dropdownAction}>
                <Dropdown.Item key="facebook" icon={<AiFillFacebook />}>
                    페이스북 리뷰 작성
                </Dropdown.Item>
                <Dropdown.Item key="instagram" icon={<AiFillInstagram />}>
                    인스타그램 리뷰 작성
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}
