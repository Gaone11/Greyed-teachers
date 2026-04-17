export interface StripeProduct {
  id: string;
  name: string;
  priceId: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SEX33cyJtBoQVP',
    name: 'GreyEd — Siyafunda Pro',
    priceId: 'price_1RUB57KhB7e46jXjQaGUjQU6',
    description: 'Monthly access for Cophetsheni teachers — AI lesson plans, CAPS assessments, and student management',
    mode: 'subscription'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};