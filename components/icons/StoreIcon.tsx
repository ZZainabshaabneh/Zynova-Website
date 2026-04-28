import React from 'react';

const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        d="M13.5 21v-7.5A.75.75 0 0114.25 12h.01a.75.75 0 01.75.75v7.5m-3.75-7.5V15a.75.75 0 00.75.75h.01a.75.75 0 00.75-.75V13.5m-3.75 0-1.5-1.5m0 0l-1.5 1.5m1.5-1.5V10.5a.75.75 0 00-1.5 0v1.5m3 0l1.5-1.5m0 0l1.5 1.5m-1.5-1.5V10.5a.75.75 0 00-1.5 0v1.5m6.375 3.375-1.5-1.5m0 0l-1.5 1.5m1.5-1.5V13.5a.75.75 0 00-1.5 0v1.5m3 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
);

export default StoreIcon;