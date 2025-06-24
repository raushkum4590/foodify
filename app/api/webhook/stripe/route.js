import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import GlobalApi from '@/app/_Utils/GlobalApi';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment succeeded:', session.id);
      
      try {
        // Update order status in database
        // You might need to create an UpdateOrderStatus function in GlobalApi
        // await GlobalApi.UpdateOrderStatus(session.metadata.orderId, 'Paid');
        
        console.log('Order status updated successfully');
      } catch (error) {
        console.error('Error updating order status:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);
      
      try {
        // Update order status to failed
        // await GlobalApi.UpdateOrderStatus(paymentIntent.metadata.orderId, 'Payment Failed');
      } catch (error) {
        console.error('Error updating failed order status:', error);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
