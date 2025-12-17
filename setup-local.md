# Local Setup Instructions

## Option 1: PostgreSQL Setup (Recommended for Production)

1. Install PostgreSQL:

   - Windows: Download from https://www.postgresql.org/download/windows/
   - Set password for 'postgres' user during installation

2. Create database:

   ```sql
   createdb library_db
   psql -d library_db -f database/schema.sql
   ```

3. Update .env file with your PostgreSQL credentials

4. Run application:
   ```bash
   npm start
   ```

## Option 2: SQLite Setup (Quick Local Testing)

For quick local testing without PostgreSQL installation, I'll create an SQLite version.

1. Install SQLite dependency:

   ```bash
   npm install sqlite3
   ```

2. Run with SQLite:
   ```bash
   npm run dev-sqlite
   ```

The application will be available at http://localhost:3000
