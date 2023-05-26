import { stripe } from "@/lib/stripe";
import { ImageContainer, SuccessContainer } from "@/styles/pages/success";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";

interface ISuccessProps {
    customerName: string
    products: {
        name: string
        imageUrl: string
    }
}

export default function Success({customerName, products}: ISuccessProps){
    return (
        <>
            <Head>
                <title>Compra Efetuada | Ignite Shop</title>
                <meta name="roboto" content="noindex" />
            </Head>
            
            <SuccessContainer>
                <h1>Compra efetuada!</h1>
                <ImageContainer>
                    <Image src={products.imageUrl} alt="" width={120} height={120}/>
                </ImageContainer>
                <p>
                    Uhuul <strong>{customerName}</strong>, sua <strong>{products.name}</strong> já esta a caminho da sua casa.
                </p>

                <Link href={'/'}>
                    Voltar ao catálogo
                </Link>
            </SuccessContainer>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    if (!query.session_id) {
        return{
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const sessionId = String(query.session_id)


    const response = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'line_items.data.price.product']
    })

    const customerName = response.customer_details?.name
    const product = response.line_items?.data[0].price?.product as Stripe.Product


    return {
        props:{
            customerName,
            products: {
                name: product.name,
                imageUrl: product.images[0]
            }
        }
    }
}