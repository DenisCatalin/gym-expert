declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MAGIC_API: string;
      NEXT_PUBLIC_STRIPE_API_PUBLISHABLE_KEY: string;
    }
  }
}

export {};