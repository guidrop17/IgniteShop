import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Head from "next/head"
import { useState } from "react"

import Stripe from "stripe"
import axios from "axios"

import { stripe } from "@/lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product"

interface IProductProps {
    products: {
        id: string
        name: string
        imageUrl: string
        price: string
        description: string
        defaultPriceId: string
    }
}

export default function Product({ products }: IProductProps) {
    const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

    const handleBuyProduct = async () => {
        try {
            setIsCreatingCheckoutSession(true)
            const response = await axios.post('/api/checkout', {
                priceId: products.defaultPriceId
            })

            const { checkoutUrl } = response.data

            window.location.href = checkoutUrl
        }
        catch (err) {
            setIsCreatingCheckoutSession(false)
            alert("ERROOOO")

        }
    }
    return (
        <>
            <Head>
                <title>{products.name} | Ignite Shop</title>
            </Head>

            <ProductContainer>
                <ImageContainer>
                    <Image src={products.imageUrl} alt="" width={520} height={480}/>
                </ImageContainer>
                <ProductDetails>
                    <h1>{products.name}</h1>
                    <span>{products.price}</span>
                    <p>{products.description}</p>
                    <button 
                        disabled={isCreatingCheckoutSession} 
                        onClick={handleBuyProduct}
                        >
                        Comprar agora
                    </button>
                </ProductDetails>
            </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps<any, {id: string}> = async ({ params }) => {
    const productId = params?.id ?? '';

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price']
    })

    const price = product.default_price as Stripe.Price
    const unitAmount = price.unit_amount ? price.unit_amount / 100 : 0;

    return {
        props: {
            products: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(unitAmount),
                description: product.description,
                defaultPriceId: price.id
            }
        },
        revalidate: 60 * 60 * 1
    }
}