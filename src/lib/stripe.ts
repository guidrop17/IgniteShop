import Stripe from "stripe"

const stripeSecretKey = process.env.NEXT_SECRET_STRIPE_API_KEY || '';

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2022-11-15",
    appInfo: {
        name: 'Ignite Shop'
    }
})