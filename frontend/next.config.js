/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
}

module.exports =  nextConfig;

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'assets/styles')],
  },
}

module.exports = {
  images: {
    domains: ['www.themoviedb.org'],
  },
};
