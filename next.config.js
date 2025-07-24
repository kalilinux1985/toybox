/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'flagsapi.com',  // Used for country flags in the profile component
      'sgrymumupawnbsyinkec.supabase.co'  // Supabase storage for avatars
    ],
  },
}

module.exports = nextConfig