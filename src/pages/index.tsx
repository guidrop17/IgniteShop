import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import Stripe from 'stripe'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

import { HomeContent, Product } from '@/styles/pages/home'
import { stripe } from '@/lib/stripe'
import Head from 'next/head'


interface IHomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: string
  }[]
}

export default function Home({products}: IHomeProps) {
  const [ sliderRef ] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })
  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <HomeContent ref={sliderRef} className='keen-slider'>
        {products.map(({id, imageUrl, name, price}) => {
          return (
            <Link 
              key={id}
              href={`/product/${id}`}
              prefetch
            >
              <Product className='keen-slider__slide'>
                <Image src={imageUrl} alt='' width={520} height={480}/>
                <footer>
                  <strong>{name}</strong>
                  <span>{price}</span>
                </footer>
              </Product>
            </Link>
          )
        })}
      </HomeContent>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(products => {
    const price = products.default_price as Stripe.Price
    const unitAmount = price.unit_amount ? price.unit_amount / 100 : 0;

    return {
      id: products.id,
      name: products.name,
      imageUrl: products.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(unitAmount),   
    }
  })
  
  return {
    props: {
      products: products,
    },
    revalidate: 60 * 60 * 2
  }
}
