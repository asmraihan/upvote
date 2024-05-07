import React from 'react';

interface SVGLoaderProps {
  color?: string;
  size?: number;
}

const SVGLoader: React.FC<SVGLoaderProps> = ({ color = '#000000', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <style>
      {`
        .spinner_nOfF {
          animation: spinner_qtyZ 2s cubic-bezier(0.36,.6,.31,1) infinite;
          fill: ${color};
        }
        .spinner_fVhf {
          animation-delay: -0.5s;
        }
        .spinner_piVe {
          animation-delay: -1s;
        }
        .spinner_MSNs {
          animation-delay: -1.5s;
        }
        @keyframes spinner_qtyZ {
          0% {
            r: 0;
          }
          25% {
            r: 3px;
            cx: 4px;
          }
          50% {
            r: 3px;
            cx: 12px;
          }
          75% {
            r: 3px;
            cx: 20px;
          }
          100% {
            r: 0;
            cx: 20px;
          }
        }
      `}
    </style>
    <circle className="spinner_nOfF" cx="4" cy="12" r="3"/>
    <circle className="spinner_nOfF spinner_fVhf" cx="4" cy="12" r="3"/>
    <circle className="spinner_nOfF spinner_piVe" cx="4" cy="12" r="3"/>
    <circle className="spinner_nOfF spinner_MSNs" cx="4" cy="12" r="3"/>
  </svg>
);

export default SVGLoader;