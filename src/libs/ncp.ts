import 'dotenv/config'
import CryptoJS from 'crypto-js' // createSignature()에서 사용 

const NCP_API_URL = "https://sens.apigw.ntruss.com"

// .env 파일에서 키를 가져옴
const { NCP_SERVICE_ID, NCP_ACCESS_KEY, NCP_SECRET_KEY, NCP_SENDER_NUMBER } = process.env

// 메시지 발송 API 문서 참고:
// https://api.ncloud-docs.com/docs/ai-application-service-sens-smsv2#메시지-발송
export async function sendSMS(phoneNumber: string, content: string) {
    const method = 'POST'
    const queryString = `/sms/v2/services/${NCP_SERVICE_ID}/messages`
    const requestURL = NCP_API_URL + queryString
    const nowDateString = Date.now().toString()
    const signature = createSignature(method, queryString, nowDateString)

    // API 문서의 요청 URL 참고
    const headers: HeadersInit = {
        "Content-Type": "application/json; charset=utf-8",
        "x-ncp-apigw-timestamp": nowDateString, // {Timestamp}
        "x-ncp-iam-access-key": NCP_ACCESS_KEY, // {Sub Account Access Key}
        "x-ncp-apigw-signature-v2": signature // {API Gateway Signature}
    }

    // API 문서의 요청 Body 참고
    const body: BodyInit = JSON.stringify({
        type: "SMS",
        from: NCP_SENDER_NUMBER, // 발신번호
        content: content,
        messages: [
            { to: `${phoneNumber}` }
        ]
    })

    // 응답 예시
    // {
    //     "requestId":"string",
    //     "requestTime":"string",
    //     "statusCode":"string",
    //     "statusName":"string"
    // }
    const response = await fetch(requestURL, {
        method: method,
        headers: headers,
        body: body
    })

    const test = await response.json()
    console.log(test)
    return test
}

// 메시지 발송 API의 x-ncp-apigw-signature-v2 값을 넣기 위해
// HMAC(Hash-based Message Authentication Code) 사용
// https://api.ncloud-docs.com/docs/common-ncpapi
function createSignature(method: string, url: string, timestamp: string): string {
    const space = " "
    const newLine = "\n"

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, NCP_SECRET_KEY)
    hmac.update(method)
    hmac.update(space)
    hmac.update(url)
    hmac.update(newLine)
    hmac.update(timestamp)
    hmac.update(newLine)
    hmac.update(NCP_ACCESS_KEY)

    const hash = hmac.finalize()
    const signature = hash.toString(CryptoJS.enc.Base64)

    return signature
}
