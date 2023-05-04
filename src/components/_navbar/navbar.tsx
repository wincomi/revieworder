import { Button, Grid, Link, Navbar, Spacer, Text } from "@nextui-org/react"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import { ImSpoonKnife } from "react-icons/im"

export type NavbarMenuItem = {
    id: string
    name: string,
    path: string,
    icon?: ReactNode
}

export interface NavbarProps {
    title: string,
    menu: NavbarMenuItem[],
    activeColor?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "neutral",
    children?: ReactNode
}  
  
export default ({ title, menu, activeColor, children }: NavbarProps) => {
    const router = useRouter()

    return (
        <Navbar variant="sticky" isBordered>
            <Navbar.Brand>
                <Link onClick={() => router.push('/')}>
                    <Text b color="text" css={{ fontSize: 20, ml: 8 }}>
                        <ImSpoonKnife style={{ verticalAlign: 'text-bottom'}} /> {title}
                    </Text>
                </Link>
            </Navbar.Brand>
            <Navbar.Content activeColor={activeColor}>
                {menu.map((item) =>
                    <Navbar.Link
                        key={item.id}
                        onClick={() => router.push(item.path)}
                        isActive={router.pathname == item.path}
                        css={{ width: 80 }}
                    >
                        <Grid.Container css={(router.pathname == item.path) ? { color: `$colors$${activeColor}` } : {}}>
                            <Grid xs={12} justify="center" css={{ fontSize: 24 }}>{item.icon}</Grid>
                            <Spacer y={0.5} />
                            <Grid xs={12} justify="center" css={{ fontSize: 12 }}>{item.name}</Grid>
                        </Grid.Container>
                    </Navbar.Link>
                )}
            </Navbar.Content>
            <Navbar.Content>
                {children}
            </Navbar.Content>
        </Navbar>
    )
}
