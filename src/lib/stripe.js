import Stripe from 'stripe';

console.log(
'STRIPE EXISTS:',
!!process.env.STRIPE_SECRET_KEY
);

const stripe = new Stripe(
process.env.STRIPE_SECRET_KEY
);

export default stripe;