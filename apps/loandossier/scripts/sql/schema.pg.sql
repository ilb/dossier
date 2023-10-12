DROP DATABASE IF EXISTS loandossier;
create database loandossier;
CREATE USER loandossier WITH PASSWORD 'loandossier';
GRANT ALL PRIVILEGES ON DATABASE loandossier to loandossier;
ALTER USER loandossier CREATEDB;
