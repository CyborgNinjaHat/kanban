import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '*.{ts,tsx}': ['oxlint --fix', 'oxfmt'],
  '*.{css,html,json,jsonc,md,yaml,yml}': 'oxfmt',
};

export default config;
