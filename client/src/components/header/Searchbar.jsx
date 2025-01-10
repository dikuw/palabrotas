import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useTranslation } from "react-i18next";

import { useContentStore } from '../../store/content';
import { useTagStore } from '../../store/tag';

import { countries } from '../shared/countries';


const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 900px;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputContainer = styled.div`
  position: relative;
  flex: ${props => props.flex || 'initial'};
  width: ${props => props.width || 'auto'};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const InputBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1.5px dashed #000;
  border-radius: 20px;
  background: transparent;
  top: 5.5px;
  left: 3px;
  pointer-events: none;
`;

const SearchBarInner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #000;
  border-radius: 20px;
  padding: 5px 10px;
  background-color: white;
  width: 100%;
`;

const SearchBarDiv = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  padding: 30px 0; 
  align-items: center;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  padding: 5px;
  font-size: 14px;
  
  &::placeholder {
    font-size: 14px;
    color: #757575;
  }
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 5px;
  cursor: pointer;
`;

const CountrySelect = styled.div`
  position: relative;
  width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const TagSelect = styled.div`
  position: relative;
  width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledSelect = styled(Select)`
  .react-select__control {
    border: 1px solid #000;
    border-radius: 20px;
    min-height: 36px;
    font-size: 14px;
    background-color: white;
  }
  .react-select__placeholder {
    font-size: 14px;
    color: #757575;
  }
  .react-select__input {
    font-size: 14px;
  }
  .react-select__single-value {
    font-size: 14px;
  }
  .react-select__multi-value {
    border-radius: 10px;
  }
  .react-select__indicators {
    height: 100%;
  }
  .react-select__indicator-separator {
    width: 1px;
    margin: 3px 0;
    background: none;
    border-left: 1.5px dashed #000;
    align-self: stretch;
  }
`;

export default function SearchBar() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const { searchContents, clearSearch, filterByCountries, filterByTags } = useContentStore();
  const { getTags, tags } = useTagStore();

  useEffect(() => {
    getTags();
  }, [getTags]);

  const handleCountryChange = useCallback((selected) => {
    const values = selected?.map(option => option.value) || [];
    setSelectedCountries(selected || []);
    filterByCountries(values);
    if (searchTerm.trim()) {
      searchContents(searchTerm);
    } else {
      searchContents('');
    }
  }, [filterByCountries, searchContents, searchTerm]);

  const handleTagChange = useCallback((selected) => {
    const values = selected?.map(option => option.value) || [];
    setSelectedTags(selected || []);
    filterByTags(values);
    if (searchTerm.trim()) {
      searchContents(searchTerm);
    } else {
      searchContents('');
    }
  }, [filterByTags, searchContents, searchTerm]);

  const handleTextChange = useCallback((e) => {
    const text = e.target.value;
    setSearchTerm(text);
    if (!text.trim()) {
      clearSearch();
    } else {
      searchContents(text);
    }
  }, [clearSearch, searchContents]);

  const countryOptions = React.useMemo(() => 
    countries.map(country => ({
      value: country.code,
      label: t(`${country.name}`)
    }))
  , [t]);

  const tagOptions = React.useMemo(() => 
    tags?.map(tag => ({
      value: tag._id,
      label: tag.name
    })) || []
  , [tags]);

  return (
    <SearchBarDiv>
      <SearchInputWrapper>
        <InputContainer flex="1">
          <InputBackground />
          <SearchBarInner>
            <SearchInput 
              type="text" 
              placeholder={t("Search...")} 
              value={searchTerm}
              onChange={handleTextChange}
            />
            {searchTerm ? (
              <SearchIconWrapper onClick={() => {
                setSearchTerm('');
                clearSearch();
              }}>
                <FaTimes />
              </SearchIconWrapper>
            ) : (
              <SearchIconWrapper>
                <FaSearch />
              </SearchIconWrapper>
            )}
          </SearchBarInner>
        </InputContainer>
        
        <InputContainer width="200px">
          <InputBackground />
          <StyledSelect
            isMulti
            options={countryOptions}
            value={selectedCountries}
            onChange={handleCountryChange}
            placeholder={t("Select countries...")}
            classNamePrefix="react-select"
          />
        </InputContainer>
        
        <InputContainer width="200px">
          <InputBackground />
          <StyledSelect
            isMulti
            options={tagOptions}
            value={selectedTags}
            onChange={handleTagChange}
            placeholder={t("Select tags...")}
            classNamePrefix="react-select"
          />
        </InputContainer>
      </SearchInputWrapper>
    </SearchBarDiv>
  );
}