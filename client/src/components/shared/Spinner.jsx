import React from 'react';
import styled from 'styled-components';

const SpinnerSVG = styled.svg`
  animation: rotate 1s linear infinite;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
  
  & .path {
    stroke: var(--primary);
    stroke-width: 4;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

export const Spinner = ({ size }) => (
  <SpinnerSVG viewBox="0 0 50 50" size={size}>
    <circle
      className="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
    />
  </SpinnerSVG>
);

export default Spinner;
