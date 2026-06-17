import stripe from "@/lib/stripe";
import {NextResponse} from "next/server";


export async function POST(req){

const {plan}=await req.json();



const session =
await stripe.checkout.sessions.create({

payment_method_types:[
'card'
],

mode:'payment',


line_items:[

{

price_data:{


currency:'usd',

product_data:{

name:'NestMe Agent Plan'

},

unit_amount:9900

},

quantity:1

}

],



success_url:


'https://nestme.in/payment-success?session_id={CHECKOUT_SESSION_ID}',



cancel_url:


'https://nestme.in/subscribe',



metadata:{


plan


}

});



return NextResponse.json({

url:session.url

});

}