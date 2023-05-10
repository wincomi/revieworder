import { User } from '@prisma/client'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { Session } from 'inspector'

export async function tossPayment(
    // 일반 toss 변수
    tossClientKey: string,
    amount: number,
    tossRedirectURL: string,
    orderId?: string,
    orderName?: string,
    // custorm
    user?: User
) {
    const tossPayments = await loadTossPayments(tossClientKey)

    // 주문번호 랜덤 생성
    const randomOrderId = Math.random().toString(36).substring(2, 12)

    // TODO: 나중에 조건문 수정
    if (user != null && user != undefined && user.name != null) {
        // 결제 창 생성
        tossPayments
            .requestPayment('카드', {
                // 결제수단 파라미터
                // 결제 정보 파라미터
                amount: amount,
                orderId: randomOrderId,
                orderName: '리뷰오더 포인트 충전',
                customerName: user.name,
                successUrl: `${tossRedirectURL}/success?userId=${user.id}`,
                failUrl: `${tossRedirectURL}/fail`,
            })

            // 결제 실패 시
            .catch(function (error) {
                if (error.code === 'USER_CANCEL') {
                    // 결제 고객이 결제창을 닫았을 때 에러 처리
                } else if (error.code === 'INVALID_CARD_COMPANY') {
                    // 유효하지 않은 카드 코드에 대한 에러 처리
                }
            })
    }
}
