import { globalStyles } from '@/styles/glogal'
import type { AppProps } from 'next/app'
import { Container, Header } from '@/styles/pages/app'
import Image from 'next/image'
import logoimg from '../assets/logo.svg'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return(
    <Container>
      <Header>
        <Image src={logoimg} alt=''/>
      </Header>
      <Component {...pageProps} />
    </Container>
  ) 
}
