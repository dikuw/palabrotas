import privacyPolicyHtml from './privacyPolicyContent.html?raw';
import LegalDocument from './LegalDocument';

export default function PrivacyPolicy() {
  return <LegalDocument html={privacyPolicyHtml} />;
}
