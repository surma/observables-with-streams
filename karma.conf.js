/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function(config) {
  const configuration = {
      basePath: '',
      frameworks: ['mocha', 'chai'],
      files: [
        {
          pattern: 'ows.js',
          included: false,
        },
        {
          pattern: 'tests/utils.js',
          included: false,
        },
        {
          pattern: 'tests/*.js',
          type: 'module',
        },
      ],
      reporters: ['progress'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      singleRun: true,
      concurrency: Infinity,
      browsers: ['DockerChrome'],
      // Remove these 2 lines once this PR lands
      // https://github.com/karma-runner/karma/pull/2834
      customContextFile: 'tests/context.html',
      customDebugFile: 'tests/debug.html',
      customLaunchers: {
        DockerChrome: {
            base: 'ChromeCanaryHeadless',
            flags: ['--no-sandbox', '--enable-experimental-web-platform-features'],
        },
      },
    };

    if (process.env.INSIDE_DOCKER)
      configuration.browsers = ['DockerChrome'];

    config.set(configuration);
};
