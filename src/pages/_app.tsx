import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { createTheme, NextUIProvider, useSSR } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

const lightTheme = createTheme({
    type: 'light',
})

const darkTheme = createTheme({
    type: 'dark',
})

export default function App({ Component, pageProps }: AppProps) {
    const { isBrowser } = useSSR()

    return (
        isBrowser && (
            <SessionProvider session={pageProps.session}>
                <NextThemesProvider
                    defaultTheme="system"
                    attribute="class"
                    value={{ light: lightTheme.className, dark: darkTheme.className }}
                >
                    <NextUIProvider>
                        <Component {...pageProps} />
                    </NextUIProvider>
                </NextThemesProvider>
            </SessionProvider>
        )
    )
}
