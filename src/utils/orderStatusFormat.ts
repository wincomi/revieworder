export default (status: string) => {
    switch (status) {
        case 'REQUESTED':
            return '주문 요청'
            break
        case 'CONFIRMED':
            return '주문 확인'
            break
        case 'COMPLETED':
            return '주문 완료'
            break
        case 'CANCELED':
            return '주문 취소'
            break
        default:
            return 'Error'
    }
}
