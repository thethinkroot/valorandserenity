import path from 'node:path';
import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig(async () => {
  const migrationsPath = path.join(__dirname, 'migrations');
  const migrations = await readD1Migrations(migrationsPath);

  return {
    test: {
      setupFiles: ['./test/apply-migrations.js'],
      poolOptions: {
        workers: {
          wrangler: { configPath: './wrangler.toml' },
          miniflare: {
            // Test-only binding so the setup file below can apply the same
            // migrations that a real deploy would run via
            // `wrangler d1 migrations apply`.
            bindings: { TEST_MIGRATIONS: migrations },
          },
        },
      },
    },
  };
});
