-- Dev-only: clears migration history so you can baseline with prisma/migrations content.
-- Run: dotenv -e .env -e backend/.env -e .env.local -- prisma db execute --schema prisma/schema.prisma --file scripts/truncate-prisma-migrations.sql
TRUNCATE TABLE "_prisma_migrations";
