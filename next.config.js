/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self';
  child-src example.com;
  style-src 'self' example.com;
  font-src 'self';  
`;

const securityHeaders = [
  //Browsers can only be accessed via https
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000;",
  },
  //Header stops browser from loading if XSS detected
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  //Prevent XSS exploits for file sharing/uploading
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  //Prevent XSS, click jacking, and injection attacks
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
