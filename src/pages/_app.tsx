import '../styles/globals.css'
import { Theme } from '@/theme'
import { trpc } from '@/utils/trpc'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { ComponentType, ReactElement, ReactNode } from 'react'

export type Page<P = unknown> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode
  layout?: ComponentType
}

type Props = AppProps & {
  Component: Page
}

function MyApp({ Component, pageProps }: Props) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <SessionProvider session={pageProps.session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>
      </ThemeProvider>
    </>
  )
}

export default trpc.withTRPC(MyApp)
