import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { createTheme, NextUIProvider } from '@nextui-org/react'

const lightTheme = createTheme({
  type: 'light'
})

const darkTheme = createTheme({
  type: 'dark'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <NextUIProvider theme={darkTheme}>
        <Component {...pageProps} />
      </NextUIProvider>
    </SessionProvider>
  )
}
