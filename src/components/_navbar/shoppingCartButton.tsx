import { Button, Badge } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FaShoppingCart } from 'react-icons/fa'

type ShoppingCartButtonProps = {
    count: number
}

export default ({ count }: ShoppingCartButtonProps) => {
    const session = useSession()
    const router = useRouter()

    if (session.data?.user != null) {
        return (
            <Badge color="error" content={count} shape="circle" disableAnimation>
                <Button onPress={() => router.push('/cart')} icon={<FaShoppingCart />} auto color="gradient" />
            </Badge>
        )
    } else {
        return <></>
    }
}
