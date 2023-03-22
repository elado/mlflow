// Disable Emotion in tests as it's slowing them down, and many tests with enzyme rely on specific node structure that Emotion interferes with
const isTestEnv = process.env.NODE_ENV === 'test';
const useEmotion = !isTestEnv;

module.exports = {
  presets: [
    require.resolve('@babel/preset-env'),
    [
      require.resolve('@babel/preset-react'),
      {
        runtime: 'automatic',

        ...(useEmotion && {
          importSource: '@emotion/react',
        }),
      },
    ],
    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    useEmotion && [require.resolve('@emotion/babel-plugin'), { sourceMap: false }],
    [
      require.resolve('babel-plugin-formatjs'),
      {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
        // AST is disabled in tests because it turns i18n strings to an array, and some tests rely on it to be a string
        ast: !isTestEnv,
        removeDefaultMessage: false,
      },
    ],
  ].filter(Boolean),
};
