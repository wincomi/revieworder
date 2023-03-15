import { Container, Button, User, Loading, Spacer } from '@nextui-org/react'
import { ReactNode } from 'react'
import Navbar from '@/components/navbar'
import { NavbarMenuItem } from '@/components/navbar'

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
            <Navbar menu={menu} />
            <Container lg css={{mt: 32}}>
                {children}
            </Container>
        </main>
    )
}
