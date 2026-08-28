import { applyD1Migrations, env } from 'cloudflare:test';

// Setup files run outside per-test-file storage isolation, and may run more
// than once. applyD1Migrations only applies migrations that haven't already
// been applied, so calling this here is safe.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
