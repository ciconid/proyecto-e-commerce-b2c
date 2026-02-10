#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER ecommerce_app WITH PASSWORD 'password7890';
    GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecommerce_app;
    GRANT ALL PRIVILEGES ON SCHEMA public TO ecommerce_app;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ecommerce_app;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ecommerce_app;
EOSQL