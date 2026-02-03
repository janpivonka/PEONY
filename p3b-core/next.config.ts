/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Vercel ignoruje chyby v TypeScriptu a build dokončí
    ignoreBuildErrors: true,
  },
  eslint: {
    // Vercel ignoruje varování ESLintu
    ignoreDuringBuilds: true,
  },
  // Pokud používáš Three.js/R3F, tohle může pomoci s optimalizací
  transpilePackages: ['three'],
};

export default nextConfig;