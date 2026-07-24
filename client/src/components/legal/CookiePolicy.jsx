import cookiePolicyHtml from './cookiePolicyContent.html?raw';
import LegalDocument from './LegalDocument';

export default function CookiePolicy() {
  return <LegalDocument html={cookiePolicyHtml} />;
}
