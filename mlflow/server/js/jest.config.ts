import type { Config } from '@jest/types';

import getBaseConfig from '@databricks/config-jest/config';

import packageJson from './package.json';

const baseConfig = getBaseConfig({
  project: packageJson.name,
  compiler: 'babel',
  transpiledModules: ['@databricks/design-system'],
});

const config: Config.InitialOptions = {
  ...baseConfig,
  setupFiles: [...(baseConfig.setupFiles ?? []), '<rootDir>/scripts/throw-on-prop-type-warning.js'],
  setupFilesAfterEnv: [...(baseConfig.setupFilesAfterEnv ?? []), '<rootDir>/src/setupTests.js'],

  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // TODO - only OSS?
  globalSetup: '<rootDir>/scripts/global-setup.js',

  // ML-20462 Restore resetMocks
  resetMocks: false,
  restoreMocks: false,
  clearMocks: false,
};

export default config;
