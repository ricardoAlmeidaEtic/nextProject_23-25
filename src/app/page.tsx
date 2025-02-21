"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/homepage');
  }, [router]); // Executa apenas uma vez após a montagem

  return null; // Não renderiza nada na tela, pois está redirecionando
}
