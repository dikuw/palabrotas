import styled from 'styled-components';

const OuterContainer = styled.div`
  padding: 20px;
  padding-top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;

const PageWrapper = styled.div`
  width: 98%;
  margin: 10px auto 24px;
  background-color: white;
  border-radius: 9px;
  border: 1px solid #000;
  padding: 24px;
  box-sizing: border-box;
`;

const PolicyContent = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;

  img {
    max-width: 100%;
    height: auto;
  }
`;

export default function LegalDocument({ html }) {
  return (
    <OuterContainer>
      <PageWrapper>
        <PolicyContent dangerouslySetInnerHTML={{ __html: html }} />
      </PageWrapper>
    </OuterContainer>
  );
}
