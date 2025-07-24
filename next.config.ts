/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... konfigurasi lainnya
  logging: {
    fetches: {
      fullUrl: true, // Akan menampilkan URL lengkap dari setiap fetch
    },
  },
};

export default nextConfig;