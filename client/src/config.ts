export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "";
export const NODE_ENV = import.meta.env.MODE ?? "development";
export const IS_PRODUCTION = NODE_ENV === "production";

export const config = {
  apiUrl: API_URL,
  stripePublishableKey: STRIPE_PUBLISHABLE_KEY,
  nodeEnv: NODE_ENV,
  isProduction: IS_PRODUCTION,
};
