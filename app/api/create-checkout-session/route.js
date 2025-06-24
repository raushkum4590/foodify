import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    const { 
      amount, 
      currency = 'inr', // Changed default currency to INR
      orderData,
      successUrl,
      cancelUrl 
    } = await request.json();

    // Convert amount to paise (Stripe uses paise for INR, like cents for USD)
    const amountInPaise = Math.round(amount * 100);// Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      locale: 'en', // Explicitly set locale to prevent module loading issues
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Food Order - ${orderData.restaurantName}`,
              description: `Order for ${orderData.email}`,
            },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],mode: 'payment',
      success_url: successUrl || `http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `http://localhost:3000/checkout/cancel`,
      metadata: {
        orderId: orderData.orderId || 'N/A',
        email: orderData.email,
        restaurantName: orderData.restaurantName,
        items: JSON.stringify(orderData.items),
      },
      customer_email: orderData.email,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
