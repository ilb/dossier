npm i
cp .env.example .env
cat sql/schema.pg.sql | sudo -u postgres psql
npx prisma generate