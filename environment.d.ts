declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MAGIC_API: string;
    }
  }
}

export {};