import Stripe from 'stripe';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-03-31.basil',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { amount } = await request.json();

    if (!amount || amount < 3.5 || amount > 100) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
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

    return Response.json({ url: session.url });
  } catch (err) {
    return Response.json(
      { error: err.message, type: err.type || 'unknown' },
      { status: 500 }
    );
  }
}
