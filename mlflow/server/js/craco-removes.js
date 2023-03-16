const url = require('url');
const path = require('path');
const fs = require('fs');
const { ModuleFederationPlugin } = require('webpack').container;
const { execSync } = require('child_process');
const webpack = require('webpack');

/**
 * In Databricks, we send a cookie with a CSRF token and set the path of the cookie as "/mlflow".
 * We need to rewrite the path to "/" for the dev index.html/bundle.js to use the CSRF token.
 */
function rewriteCookies(proxyRes) {
  if (proxyRes.headers['set-cookie'] !== undefined) {
    const newCookies = [];
    proxyRes.headers['set-cookie'].forEach((c) => {
      newCookies.push(c.replace('Path=/mlflow', 'Path=/'));
    });
    proxyRes.headers['set-cookie'] = newCookies;
  }
}

function getDevProxyPort() {
  if (process.env.START_FEATURE_STORE) {
    return process.env.FEATURE_STORE_MFE_DEV
      ? process.env.DATABRICKS_DEV_PROXY_FEATURE_STORE_PORT
      : process.env.DATABRICKS_DEV_PROXY_FEATURE_STORE_IFRAME_PORT;
  }

  return process.env.MLFLOW_MFE_DEV
    ? process.env.DATABRICKS_DEV_PROXY_MLFLOW_PORT
    : process.env.DATABRICKS_DEV_PROXY_MLFLOW_IFRAME_PORT;
}
// END-EDGE
module.exports = function ({ env }) {
  const config = {
    jest: {
      configure: (jestConfig, { env, paths, resolve, rootDir }) => {
        /*
         * Jest running on the currently used node version is not yet capable of ESM processing:
         * https://jestjs.io/docs/ecmascript-modules
         * https://nodejs.org/api/vm.html#vm_class_vm_module
         *
         * Since there are certain ESM-built dependencies used in MLFLow, we need
         * to add a few exceptions to the standard ignore pattern for babel.
         */
        const createIgnorePatternForESM = () => {
          // List all the modules that we *want* to be transpiled by babel
          const transpiledModules = [
            '@databricks/design-system',
            '@babel/runtime/.+?/esm',
            '@ant-design/icons',
            '@ant-design/icons-svg',
          ];

          // We'll ignore only dependencies in 'node_modules' directly within certain
          // directories in order to avoid false positive matches in nested modules.
          const validNodeModulesRoots = [
            'mlflow/web/js',
          ];

          // prettier-ignore
          // eslint-disable-next-line max-len
          return `(${validNodeModulesRoots.join('|')})\\/node_modules\\/((?!(${transpiledModules.join('|')})).)+(js|jsx|mjs|cjs|ts|tsx|json)$`;
        };

        jestConfig.resetMocks = false; // ML-20462 Restore resetMocks
        jestConfig.collectCoverageFrom = [
          'src/**/*.{js,jsx}',
          '!**/*.test.{js,jsx}',
          '!**/__tests__/*.{js,jsx}',
        ];
        jestConfig.coverageReporters = ['lcov'];
        jestConfig.setupFiles = [
          'jest-canvas-mock',
          '<rootDir>/scripts/throw-on-prop-type-warning.js',
        ];
        // Adjust config to work with dependencies using ".mjs" file extensions
        jestConfig.moduleFileExtensions.push('mjs');
        // Remove when this issue is resolved: https://github.com/gsoft-inc/craco/issues/393
        jestConfig.transform = {
          '\\.[jt]sx?$': ['babel-jest', { configFile: './jest.babel.config.js' }],
          ...jestConfig.transform,
        };
        jestConfig.transformIgnorePatterns = ['\\.pnp\\.[^\\/]+$', createIgnorePatternForESM()];
        jestConfig.globalSetup = '<rootDir>/scripts/global-setup.js';
        return jestConfig;
      },
    },
  };
  return config;
};
