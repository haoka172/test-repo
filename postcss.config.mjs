const config = {
  plugins: [
    "@tailwindcss/postcss",
    ...(process.env.NODE_ENV === 'production' ? [
      ['cssnano', {
        preset: ['advanced', {
          discardComments: { removeAll: true },
          reduceIdents: true,
          mergeIdents: true,
          discardUnused: true,
          autoprefixer: false,
        }]
      }]
    ] : [])
  ],
};

export default config;
