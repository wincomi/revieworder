import { Button, Badge } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { FaShoppingCart } from 'react-icons/fa'

export default () => {
    const router = useRouter()

    return (
        <Badge color="error" content="5" shape="circle" disableAnimation>
            <Button onPress={() => router.push('/cart')} icon={<FaShoppingCart />} auto color="gradient" />
        </Badge>
    )
}
