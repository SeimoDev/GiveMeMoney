import Stripe from 'stripe';

export async function onRequestPost(context) {
  const { request, env } = context;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const { amount } = await request.json();

  if (!amount || amount < 3.5 || amount > 100) {
    return new Response(JSON.stringify({ error: 'Invalid amount' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const origin = new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    automatic_payment_methods: { enabled: true },
    line_items: [
      {
        price_data: {
          currency: 'cny',
          product_data: { name: 'Give Me Money' },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}?status=success&amount=${amount}`,
    cancel_url: `${origin}?status=cancel`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
