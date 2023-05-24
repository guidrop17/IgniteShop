import Image from 'next/image'

import { useKeenSlider } from 'keen-slider/react'

import { HomeContent, Product } from '@/styles/pages/home'

import camiseta1 from '@/assets/camisetas/camiseta1.png'
import camiseta2 from '@/assets/camisetas/camiseta2.png'
import camiseta3 from '@/assets/camisetas/camiseta3.png'
import camiseta4 from '@/assets/camisetas/camiseta4.png'

import 'keen-slider/keen-slider.min.css'
import { stripe } from '@/lib/stripe'
import { GetServerSideProps } from 'next'
import Stripe from 'stripe'

interface IHomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: number
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
  <HomeContent ref={sliderRef} className='keen-slider'>
    {products.map(({id, imageUrl, name, price}) => {
      return (
        <Product className='keen-slider__slide' key={id}>
          <Image src={camiseta1} alt='' width={520} height={480}/>
          <footer>
            <strong>{name}</strong>
            <span>{price}</span>
          </footer>
        </Product>
      )
    })}
  </HomeContent>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(products => {
    const price = products.default_price as Stripe.Price

    return {
      id: products.id,
      name: products.name,
      imageUrl: products.images[0],
      price: price.unit_amount / 100,      
    }
  })
  
  return {
    props: {
      products: products,
    },
  }
}
