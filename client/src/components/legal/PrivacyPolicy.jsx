import privacyPolicyHtml from './privacyPolicyContent.html?raw';

export default function PrivacyPolicy() {
  return (
    <div dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }} />
  );
}