import cookiePolicyHtml from './cookiePolicyContent.html?raw';

export default function CookiePolicy() {
  return (
    <div dangerouslySetInnerHTML={{ __html: cookiePolicyHtml }} />
  );
}
