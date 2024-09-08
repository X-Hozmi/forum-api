# Forum API

Forum API adalah sebuah proyek backend API yang dibangun menggunakan Node.js dan Hapi.js. API ini menyediakan fitur-fitur dasar untuk forum diskusi, termasuk autentikasi, manajemen pengguna, pembuatan thread, komentar, dan balasan. Proyek ini menggunakan pendekatan TDD (Test-Driven Development) dan ORM Sequelize untuk manajemen database.

## Fitur

- **Test-Driven Development (TDD):** Pengembangan API dilakukan dengan pendekatan TDD untuk memastikan kualitas dan stabilitas kode.
- **Sequelize ORM:** Manajemen database dilakukan dengan Sequelize, mendukung migrasi database dan hubungan antar model.

## Persyaratan

- Node.js (versi 18.x atau 20.x)
- PostgreSQL (untuk database)
- NPM (Node Package Manager)

## Instalasi

1. **Clone repositori:**

   ```bash
   git clone https://github.com/X-Hozmi/forum-api.git
   cd forum-api-main
   npm install
   ```

2. **Install Dependensi**

    ```bash
   npm install
   ```

3. **Konfigurasi Lingkungan**

    ```bash
    HOST=localhost
    PORT=5000

    PGHOST=localhost
    PGPORT=5432
    PGUSER=postgres
    PGPASSWORD=mysecretpassword
    PGDATABASE=forumapi

    ACCESS_TOKEN_KEY=secret
    REFRESH_TOKEN_KEY=terces
    ACCESS_TOKEN_AGE=3600
    ```

4. **Setup Database**

    ```bash
    npm run sequelize:setup
    ```

5. **Menjalankan Server**

    ```bash
    npm run start
    ```