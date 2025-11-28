/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {}, 
  
  compiler: {
    styledComponents: true,
  },
  
  webpack: (config, { isServer }) => {
    console.log('--- FINAL LAUNCH: Using Webpack Compiler ---');
    return config;
  },
};

export default nextConfig;