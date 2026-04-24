-- Run after editing prisma/migrations/.../migration.sql so migrate resolve can re-record checksum.
DELETE FROM "_prisma_migrations" WHERE migration_name = '20260419120000_baseline';
