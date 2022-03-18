# Receipt checker bot
## Installation
### 1. Database
1.1. Create user and database
```postgresql
create user receipt_checker encrypted password 'receipt_checker';
create database receipt_checker;
grant all privileges on database receipt_checker to group receipt_checker;
```
1.2. .env
```shell
cp .env.example .env
```
```dotenv
DB_NAME=receipt_checker
DB_PORT=5432
DB_USER=receipt_checker
DB_PASSWORD=receipt_checker
```
1.3. Migrations
```shell
npm run migration:generate # Generate migrations by models
npm run migration:run # Run migrations
npm run migration:revert # Rollback migrations
```

### 2. Installation
```shell
npm install
```
### 3. Run
```shell
npm run build # for prod
npm run watch # for dev
npm run watch-debug # for debug
```
### 4. Code formatting
```shell
npm run prettier-format
```
### 4. Run in Docker
1. For local development
```shell
npm run docker:dev # start containers
npm run docker:dev:down # stop containers and remove images 
```
2. For production
```shell
npm run docker:prod # start containers
npm run docker:prod:down # stop containers and remove images 
```
3. For debug
```shell
npm run docker:debug # start containers
npm run docker:debug:down # stop containers and remove images 
```
### 5. If nodemon does not reload on files changes
```shell
sudo pkill -f node
```

### TODO:
1. Fix nodemon inside docker. Watch and debug not work inside a container.