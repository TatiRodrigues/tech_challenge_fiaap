'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.push('/docs/intro');
  }, [router]);

  return <div>Redirecionando...</div>;
}
