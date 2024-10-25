import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const FormWrapper = styled.div`
  margin-top: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid var(--primary);
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  padding: 10px 20px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--secondary);
  }
`;

const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
    setComment('');
  };

  return (
    <FormWrapper>
      <StyledForm onSubmit={handleSubmit}>
        <StyledTextarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('Add a comment...')}
          required
        />
        <SubmitButton type="submit">{t('Submit')}</SubmitButton>
      </StyledForm>
    </FormWrapper>
  );
};

export default CommentForm;