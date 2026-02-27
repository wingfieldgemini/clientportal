/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['rnbkqfmgzwxylcxvudqp.supabase.co'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    }
    return config
  },
}

module.exports = nextConfig