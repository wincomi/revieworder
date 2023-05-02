import { Container } from '@nextui-org/react'
import { ReactNode } from 'react'
import Navbar, { NavbarMenuItem } from '@/components/_navbar/navbar'
import UserButton from '@/components/_navbar/userButton'
import SettingsButton from '@/components/_navbar/settingsButton'
import ShoppingCartButton from '@/components/_navbar/shoppingCartButton'

interface LayoutProps {
    children: ReactNode
}

export default ({ children }: LayoutProps) => {
    const menu: NavbarMenuItem[] = [
        { id: "index", name: "둘러보기", path: "/" },
        { id: "order", name: "주문하기", path: "/order" },
        { id: "profile", name: "내 프로필", path: "/profile" },
    ]

    return (
        <main>
            <Navbar title="리뷰오더" menu={menu} activeColor="primary">
                <SettingsButton />
                <ShoppingCartButton count={-1} />
                <UserButton />
            </Navbar>
            <Container lg css={{ mt: 32 }}>
                {children}
            </Container>
        </main>
    )
}
