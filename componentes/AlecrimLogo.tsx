import React from 'react';
import Image from 'next/image';

export const AlecrimLogo: React.FC<{ size?: number }> = ({ size = 60 }) => {
  return (
    <Image
      src="/imagens/logo.jpg"
      alt="Alecrim Logo"
      width={size}
      height={size}
      priority
      style={{
        width: size,
        height: size,
        objectFit: 'contain'
      }}
    />
  );
};
