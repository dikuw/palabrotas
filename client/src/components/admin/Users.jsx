import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';
import Spinner from '../shared/Spinner';

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background-color: var(--primary);
  color: white;
  padding: 12px;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 20px;
`;

export default function Users() {
  const { t } = useTranslation();
  const { users, getUsers, isLoading, error } = useUserStore();
  const { authStatus } = useAuthStore();

  useEffect(() => {
    if (authStatus.user?.isAdmin) {
      getUsers();
    }
  }, [authStatus.user, getUsers]);

  if (!authStatus.user?.isAdmin) {
    return <ErrorMessage>{t("You don't have permission to view this page")}</ErrorMessage>;
  }

  if (isLoading) {
    return (
      <SpinnerContainer>
        <Spinner size="40px" />
      </SpinnerContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return t('N/A');
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container>
      <h2>{t("User Management")}</h2>
      <Table>
        <thead>
          <tr>
            <Th>{t("Name")}</Th>
            <Th>{t("Email")}</Th>
            <Th>{t("Admin")}</Th>
            <Th>{t("Created")}</Th>
            <Th>{t("Last Login")}</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.isAdmin ? '✓' : '—'}</Td>
              <Td>{formatDate(user.createdAt)}</Td>
              <Td>{formatDate(user.lastLogin)}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}