import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { FaGlobe } from 'react-icons/fa';
import styled from 'styled-components';
import {
  getRegionLabel,
  isAllCountriesCode,
  isEuropeCode,
  isLatinAmericaCode,
} from './countries';
import { EuropeIcon, SouthAmericaIcon } from './RegionIcons';

const BadgeWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  color: var(--primary);
  font-size: ${(props) => props.$size || '1rem'};
`;

const StyledGlobe = styled(FaGlobe)`
  font-size: inherit;
  color: inherit;
`;

const StyledFlag = styled(ReactCountryFlag)`
  font-size: inherit !important;
  line-height: 0;
`;

const StyledRegionIcon = styled.span`
  display: inline-flex;
  font-size: inherit;
  color: inherit;
`;

export default function CountryBadge({ code, size = '1rem', t }) {
  if (!code) return null;

  const label = getRegionLabel(code, t);

  if (isAllCountriesCode(code)) {
    return (
      <BadgeWrap $size={size} title={label} aria-label={label}>
        <StyledGlobe aria-hidden />
      </BadgeWrap>
    );
  }

  if (isLatinAmericaCode(code)) {
    return (
      <BadgeWrap $size={size} title={label} aria-label={label}>
        <StyledRegionIcon aria-hidden>
          <SouthAmericaIcon width="1em" height="1em" />
        </StyledRegionIcon>
      </BadgeWrap>
    );
  }

  if (isEuropeCode(code)) {
    return (
      <BadgeWrap $size={size} title={label} aria-label={label}>
        <StyledRegionIcon aria-hidden>
          <EuropeIcon width="1em" height="1em" />
        </StyledRegionIcon>
      </BadgeWrap>
    );
  }

  return (
    <BadgeWrap $size={size} title={label} aria-label={label}>
      <StyledFlag countryCode={String(code).toUpperCase()} svg aria-hidden />
    </BadgeWrap>
  );
}
