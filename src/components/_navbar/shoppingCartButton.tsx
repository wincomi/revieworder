import { Button, Badge } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { FaShoppingCart } from 'react-icons/fa'

type ShoppingCartButtonProps = {
    count: number
}

export default ({ count }: ShoppingCartButtonProps) => {
    const router = useRouter()

    return (
        <Badge color="error" content={count} shape="circle" disableAnimation>
            <Button onPress={() => router.push('/cart')} icon={<FaShoppingCart />} auto color="gradient" />
        </Badge>
    )
}
