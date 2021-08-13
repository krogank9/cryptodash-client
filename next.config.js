module.exports = {
  sassOptions: {
    prependData: `@use '/styles/variables' as *;`,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/analyze',
        destination: '/analyze/btc',
        permanent: true,
      },
    ]
  },
};