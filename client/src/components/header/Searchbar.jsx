import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import { useContentStore } from '../../store/content';

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

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px 10px;
  background-color: white;
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

export default function SearchBar() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { searchContents, clearSearch } = useContentStore();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchContents(searchTerm);
      setSearchTerm('');
    } else {
      clearSearch();
    }
  };

  return (
    <SearchBarDiv>
      <SearchInputWrapper>
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
      </SearchInputWrapper>
    </SearchBarDiv>
  );
}