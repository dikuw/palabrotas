import termsAndConditionsHtml from './termsAndConditionsContent.html?raw';

export default function TermsAndConditions() {
  return (
    <div dangerouslySetInnerHTML={{ __html: termsAndConditionsHtml }} />
  );
}
