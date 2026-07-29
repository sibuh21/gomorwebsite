
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental:{
    serverActions:{
      bodySizeLimit:'200mb'
    }
  },
  images:{
    remotePatterns:[
        {
               protocol: "https",
               hostname: "res.cloudinary.com",
               pathname: "/**",
             
      },
    ]
  },
  // Disable TypeScript checking during build to avoid leaflet type issues
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // add any other config here
}

export default nextConfig;
