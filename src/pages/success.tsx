import Layout from "@/components/layout";
import { Button, Text } from "@nextui-org/react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { useSession } from "next-auth/react";
import router from "next/router";
import { useEffect } from "react";

export default function SuccessPage(res: NextApiResponse) {
  const session = useSession()
  const params = new URLSearchParams(location.search);

  // URL 쿼리
  let paymentKey = params.get("paymentKey");
  let amount = params.get("amount");
  let orderId = params.get("orderId");
  let userId = params.get("userId");

  // 토스 결제 승인 시 시크릿키 사용
  const secretKey = process.env.TOSS_SECRET_KEY

  //basic64로 인코딩
  const basic64 = Buffer.from(secretKey, "utf8").toString('base64')
  
  // render할 때 한번만 작동
  useEffect(()=>{
    // 결제 승인 api
    const result = async () => await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic64}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentKey: paymentKey,
        amount: amount,
        orderId: orderId
      })
    })

    result()
    .then(async (res)=>{
      if (res.status==200 && session != null) {
        // 결제승인 성공 후 리뷰머니 충전 - 결제 승인은 한번만 되서 새로고침해도 충전x
        alert('성공')
        await fetch(`/api/user/moneyapi`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          // session의 쿠키를 보내는데 req가 없으면 필요
          credentials: 'include',

          body: JSON.stringify({
              userId: userId,
              money: Number(amount),
              opt: 'charge'
          })
      })
      }
    })
  },[])
  
    return (
      <>        
        <Layout>
          <Text h1>결제 성공</Text>   
          <Button auto flat css={{ h: '100%' }} onPress={()=>router.push('/profile')}>돌아가기</Button>        
        </Layout>             
      </>
    )
}

