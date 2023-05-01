/** @type {import('next').NextConfig} */

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
