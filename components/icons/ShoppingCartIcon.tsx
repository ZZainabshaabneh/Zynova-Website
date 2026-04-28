
import React from 'react';

const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.835l1.823-6.831A1.125 1.125 0 0018.141 5H4.491M3.75 21h16.5M5.625 17.25a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm12.75 0a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0z"
    />
  </svg>
);

export default ShoppingCartIcon;
