import React from 'react';
import { GiSouthAmerica } from 'react-icons/gi';

// Keep EuropeIcon synced with `src/assets/europe.svg` so Inkscape re-exports
// immediately affect the UI.
import EuropeSvgRaw from '../../assets/europe.svg?raw';

const europeViewBoxMatch = EuropeSvgRaw.match(/viewBox="([^"]+)"/i);
const EUROPE_VIEWBOX = europeViewBoxMatch?.[1] ?? '0 0 84 112';

const europePathMatch = EuropeSvgRaw.match(/<path\b[^>]*\bd="([^"]+)"[^>]*\/?>/i);
const EUROPE_PATH =
  europePathMatch?.[1] ??
  'M 61.500 0.925 C 53.391 1.622, 50.476 2.968, 49.610 6.416 C 48.758 9.813, 50.461 12.957, 55.074 16.500 C 60.070 20.338, 62.738 24.506, 63.583 29.796 L 64.256 34 42.996 34 C 23.414 34, 21.478 34.159, 18.469 36.019 C 14.261 38.620, 12.002 44.292, 11.994 52.270 C 11.986 61.345, 10.591 65.344, 6.460 68.131 C 2.139 71.046, 1.112 74.388, 3.342 78.273 C 4.487 80.268, 4.811 82.328, 4.393 84.946 C 3.577 90.049, 5.247 92.779, 10.645 95.167 C 13.105 96.255, 15.908 98.445, 16.874 100.034 C 19.867 104.955, 23.634 107.309, 27.294 106.545 C 29.057 106.177, 35.031 105.508, 40.569 105.058 C 59.023 103.558, 66.672 99.194, 69.433 88.594 C 71.325 81.332, 73.054 79.335, 78.923 77.631 C 82.985 76.453, 83.535 75.948, 83.813 73.152 L 84.127 70 49.608 70 L 15.089 70 16.544 65.874 C 17.345 63.605, 18 60.230, 18 58.374 L 18 55 38.953 55 C 60.863 55, 63.888 54.510, 65.883 50.640 C 72.539 37.727, 70.926 20.806, 62.398 14.099 L 59.730 12 64.931 12 C 70.629 12, 74 10.706, 74 8.520 C 74 7.547, 75.473 7.015, 78.750 6.805 C 83.305 6.513, 83.513 6.366, 83.813 3.250 L 84.127 -0 76.313 0.162 C 72.016 0.251, 65.350 0.594, 61.500 0.925';

const europeFillRuleMatch = EuropeSvgRaw.match(/fill-rule="([^"]+)"/i);
const EUROPE_FILL_RULE = europeFillRuleMatch?.[1];

/**
 * South America continent silhouette (Game Icons, CC BY 3.0).
 * @see https://game-icons.net/1x1/lorc/south-america.html
 */
export function SouthAmericaIcon(props) {
  const { title, width, height, ...rest } = props;
  return (
    <GiSouthAmerica
      aria-hidden={!title}
      title={title}
      width={width || '1em'}
      height={height || '1em'}
      {...rest}
    />
  );
}

/** Iberian peninsula + western France (solid silhouette). Source: src/assets/europe.svg */
export function EuropeIcon(props) {
  const { title, width, height, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={EUROPE_VIEWBOX}
      fill="currentColor"
      role="img"
      width={width || '1em'}
      height={height || '1em'}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={EUROPE_PATH} fillRule={EUROPE_FILL_RULE} />
    </svg>
  );
}
