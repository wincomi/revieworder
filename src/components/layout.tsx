import { Container, Button, User, Loading, Spacer } from '@nextui-org/react'
import { ReactNode } from 'react'
import Navbar from '@/components/navbar'
import { NavbarMenuItem } from '@/components/navbar'

interface LayoutProps {
    children: ReactNode
}

export default ({ children }: LayoutProps) => {
    const menu: NavbarMenuItem[] = [
        { id: "index", name: "홈", path: "/" },
        { id: "mypage", name: "마이페이지", path: "/mypage" },
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
