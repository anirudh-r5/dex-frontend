import { defineConfig } from '@wagmi/cli';
import { hardhat } from '@wagmi/cli/plugins';

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

const config = defineConfig({
  out: 'src/app/lib/generated.ts',
  contracts: [],
  plugins: [
    hardhat({
      project: '../dex-backend',
    }),
  ],
});

export default config;
