import Stripe from 'stripe';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { amount } = await request.json();

    if (!amount || amount < 3.5 || amount > 100) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card', 'alipay'],
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
      return_url: `${origin}?status=success&amount=${amount}`,
    });

    return Response.json({ clientSecret: session.client_secret });
  } catch (err) {
    return Response.json(
      { error: err.message, type: err.type || 'unknown' },
      { status: 500 }
    );
  }
}
