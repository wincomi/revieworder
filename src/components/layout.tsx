import { Container } from '@nextui-org/react'
import { ReactNode } from 'react'
import Navbar from '@/components/navbar'
import { NavbarMenuItem } from '@/components/navbar'
import NavbarUserButton from '@/components/navbarUserDropdown'
import NavbarThemeButton from '@/components/navbarThemeDropdown'
import ShoppingCartButton from '@/components/shoppingCartButton'

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
                <ShoppingCartButton count={0} />
                <NavbarThemeButton />
                <NavbarUserButton />
            </Navbar>
            <Container lg css={{ mt: 32 }}>
                {children}
            </Container>
        </main>
    )
}
