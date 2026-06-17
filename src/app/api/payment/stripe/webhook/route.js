
import stripe from '@/lib/stripe';

export async function POST(req) {
    const sig = req.headers.get('stripe-signature');

    const body = await req.text();

    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
    }

    return Response.json({
        received: true
    });
}


