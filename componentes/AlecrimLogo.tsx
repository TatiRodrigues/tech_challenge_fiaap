import React from 'react';

export const AlecrimLogo: React.FC<{ size?: number }> = ({ size = 60 }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      {/* Fundo branco circular */}
      <circle cx="100" cy="100" r="95" fill="#FFFFFF" stroke="#E8E8E8" strokeWidth="1"/>
      
      {/* Tronco principal */}
      <path d="M 100 40 Q 98 70 98 100 Q 98 130 100 160" stroke="#2D7A3E" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Folhas lado esquerdo */}
      <g fill="#2D7A3E" opacity="0.9">
        <ellipse cx="72" cy="65" rx="12" ry="8" transform="rotate(-35 72 65)"/>
        <ellipse cx="62" cy="82" rx="12" ry="8" transform="rotate(-50 62 82)"/>
        <ellipse cx="58" cy="100" rx="12" ry="8" transform="rotate(-65 58 100)"/>
        <ellipse cx="62" cy="118" rx="12" ry="8" transform="rotate(-50 62 118)"/>
        <ellipse cx="72" cy="135" rx="12" ry="8" transform="rotate(-35 72 135)"/>
      </g>
      
      {/* Folhas lado direito */}
      <g fill="#2D7A3E" opacity="0.95">
        <ellipse cx="128" cy="65" rx="12" ry="8" transform="rotate(35 128 65)"/>
        <ellipse cx="138" cy="82" rx="12" ry="8" transform="rotate(50 138 82)"/>
        <ellipse cx="142" cy="100" rx="12" ry="8" transform="rotate(65 142 100)"/>
        <ellipse cx="138" cy="118" rx="12" ry="8" transform="rotate(50 138 118)"/>
        <ellipse cx="128" cy="135" rx="12" ry="8" transform="rotate(35 128 135)"/>
      </g>
    </svg>
  );
};
