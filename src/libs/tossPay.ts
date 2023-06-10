import { User } from '@prisma/client'
import { loadTossPayments } from '@tosspayments/payment-sdk'

export async function tossPayment(
    // 일반 toss 변수
    tossClientKey: string,
    amount: number,
    tossRedirectURL: string,
    // false: 바로 결제, true: 포인트 충전
    pointPay: boolean,
    // 지금은 고정 중
    _orderId?: string,
    orderName?: string,
    // custorm
    user?: User
) {
    const tossPayments = await loadTossPayments('test_ck_Kma60RZblrqbExbOewz8wzYWBn14')

    // 주문번호 랜덤 생성
    const randomOrderId = Math.random().toString(36).substring(2, 12)

    // TODO: 나중에 조건문 수정
    if (user != null && user != undefined && orderName) {
        // 결제 창 생성
        tossPayments
            .requestPayment('카드', {
                // 결제수단 파라미터
                // 결제 정보 파라미터
                amount: amount,
                orderId: randomOrderId,
                orderName: orderName,
                customerName: user.name != null ? user.name : '이름 없음', // 구매자 이름 (휴대폰인증하는 사람들은 초반에 이름 없어서)
                successUrl: `${tossRedirectURL}/success?userId=${user.id}&payMethod=${pointPay}`,
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
