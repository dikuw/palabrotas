import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
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
`;

const SearchBarInner = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px 10px;
  background-color: white;
`;

const SearchBarDiv = styled.div`
  width: 100%;
  height: 2em;
  display: flex;
  justify-content: center;
  padding: 30px 0; 
  align-items: center;
  @media (max-width: 768px) {
    padding-left: 16px;
    padding-bottom: 40px;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  padding: 5px;
  font-size: 16px;
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 5px;
  cursor: pointer;
`;

const CountrySelect = styled(Select)`
  width: 200px;
  .react-select__control {
    border-radius: 20px;
    min-height: 36px;
    font-size: 14px;
  }
  .react-select__multi-value {
    border-radius: 10px;
  }
  .react-select__placeholder {
    font-size: 12px;
  }
  .react-select__input {
    font-size: 14px;
  }
  .react-select__single-value {
    font-size: 14px;
  }
`;

const TagSelect = styled(Select)`
  width: 200px;
  .react-select__control {
    border-radius: 20px;
    min-height: 36px;
    font-size: 14px;
  }
  .react-select__multi-value {
    border-radius: 10px;
  }
  .react-select__placeholder {
    font-size: 12px;
  }
  .react-select__input {
    font-size: 142px;
  }
  .react-select__single-value {
    font-size: 14px;
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
  }, []);

  const countryOptions = countries.map(country => ({
    value: country.code,
    label: t(`${country.name}`)
  }));

  const tagOptions = tags.map(tag => ({
    value: tag._id,
    label: tag.name
  }));

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchContents(searchTerm);
      setSearchTerm('');
    } else {
      clearSearch();
    }
  };

  const handleCountryChange = (selected) => {
    setSelectedCountries(selected);
    filterByCountries(selected?.map(option => option.value) || []);
  };

  const handleTagChange = (selected) => {
    setSelectedTags(selected);
    filterByTags(selected?.map(option => option.value) || []);
  };

  return (
    <SearchBarDiv>
      <SearchInputWrapper>
        <SearchBarInner>
          <SearchInput 
            type="text" 
            placeholder={t("Search...")} 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value.trim()) {
                clearSearch();
              }
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        <SearchIconWrapper onClick={handleSearch}>
          <FaSearch />
        </SearchIconWrapper>
        </SearchBarInner>
        <CountrySelect
          isMulti
          options={countryOptions}
          value={selectedCountries}
          onChange={handleCountryChange}
          placeholder={t("Select countries...")}
          classNamePrefix="react-select"
        />
        <TagSelect
          isMulti
          options={tagOptions}
          value={selectedTags}
          onChange={handleTagChange}
          placeholder={t("Select tags...")}
          classNamePrefix="react-select"
        />
      </SearchInputWrapper>
    </SearchBarDiv>
  );
}