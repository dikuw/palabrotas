import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Overlay = styled.div`
  display: flex;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 76;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 9px;
  padding: 24px;
  width: 100%;
  max-width: 440px;
  z-index: 77;
`;

const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 1.25rem;
`;

const Text = styled.p`
  margin: 0 0 16px;
  line-height: 1.45;
  color: #444;
  font-size: 0.95rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 12px;
  box-sizing: border-box;
`;

const ErrorText = styled.p`
  color: var(--error, #c0392b);
  margin: 0 0 12px;
  font-size: 0.9rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 24px;
  border: none;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #eee;
  color: #333;
`;

const DeleteButton = styled(Button)`
  background: #c0392b;
  color: white;
`;

export default function DeleteAccountModal({ onCancel, onConfirm, isDeleting, error }) {
  const { t } = useTranslation();
  const [confirmation, setConfirmation] = useState('');

  const canConfirm = confirmation === 'DELETE' && !isDeleting;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canConfirm) return;
    onConfirm(confirmation);
  };

  return (
    <Overlay onClick={onCancel} role="presentation">
      <Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        onClick={(e) => e.stopPropagation()}
      >
        <Title id="delete-account-title">{t('Delete Account')}</Title>
        <Text>
          {t('This permanently deletes your account. Active subscriptions will be cancelled. This cannot be undone.')}
        </Text>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="delete-confirm">
            {t('Type DELETE to confirm')}
          </Label>
          <Input
            id="delete-confirm"
            type="text"
            autoComplete="off"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            disabled={isDeleting}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Actions>
            <CancelButton type="button" onClick={onCancel} disabled={isDeleting}>
              {t('Cancel')}
            </CancelButton>
            <DeleteButton type="submit" disabled={!canConfirm}>
              {isDeleting ? t('Deleting...') : t('Delete Account')}
            </DeleteButton>
          </Actions>
        </form>
      </Modal>
    </Overlay>
  );
}
