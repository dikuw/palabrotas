import termsAndConditionsHtml from './termsAndConditionsContent.html?raw';
import LegalDocument from './LegalDocument';

export default function TermsAndConditions() {
  return <LegalDocument html={termsAndConditionsHtml} />;
}
