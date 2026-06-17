import stripe from '@/lib/stripe';
import { NextResponse } from 'next/server';

import { getAuthUser } from '@/lib/getAuthUser';


export async function POST(req){

const user =
await getAuthUser();


if(!user){

return NextResponse.json(

{
success:false
},

{
status:401
}

);

}



const {plan}=await req.json();



const prices={

basic:1200

};




const session=

await stripe.checkout.sessions.create({


payment_method_types:['card'],


mode:'payment',



line_items:[

{

price_data:{


currency:'usd',



product_data:{

name:'NestMe Agent Plan'

},



unit_amount:prices[plan]


},



quantity:1

}

],




metadata:{


userId:user._id.toString(),


plan


},





success_url:


`${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,




cancel_url:


`${process.env.NEXT_PUBLIC_APP_URL}/subscribe`


});



return NextResponse.json({

url:session.url

});


}

// import stripe from '@/lib/stripe';
// import { NextResponse } from 'next/server';

// export async function POST(req) {
//     const { plan } = await req.json();

//     const prices = { basic: 999 };

//     const session = await stripe.checkout.sessions.create({

//         payment_method_types: ['card'],
//         mode: 'payment',
//         line_items: [{
//             price_data: {
//                 currency: 'usd', product_data: {
//                     name: 'NestMe Agent'
//                 },
//                 unit_amount: 1200
//             },
//             quantity: 1
//         }],
//         success_url: 'https://nestme.in/payment-success?session_id={CHECKOUT_SESSION_ID}',
//         cancel_url: 'https://nestme.in/subscribe',

//         metadata: { plan }
//     });
//     return NextResponse.json({
//         url: session.url
//     });
// }
