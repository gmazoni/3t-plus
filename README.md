# App Web

![Intro](docs/intro.png)

**_Made with ❤️_**

[TypeScript](https://www.typescriptlang.org/),
[Next.js](https://nextjs.org/),
[NextAuth.js](https://next-auth.js.org/),
[tailwindcss](https://tailwindcss.com/),
[tRPC](https://trpc.io/),
[Zod](https://zod.dev/),
[Prisma](https://www.prisma.io/),
[trpc-openapi](https://github.com/jlalmes/trpc-openapi),
[superjson](https://github.com/blitz-js/superjson),
[BullMQ](https://docs.bullmq.io/),
[Playwright](https://playwright.dev/)

## Install

- Clone this repo
- Open VSCode and install the extension `Dev Containers` https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers
- Start the dev container

Consider all the above steps to be done inside the dev container

</div>
</div>

### Post Install

```bash
#for pre-commit hook (Optional, it avoids commiting code with lint errors)
npx husky install
```

### Development server

```bash
# run development server
pnpm dev
```

# Testing

When testing Prisma will use a separate database (test) from the development database. This is to prevent data loss when running tests. Each test will truncate the database tables before and after running automatically for `Jest` (Unit), for `Playwright` (E2E) you must do it manually.

```bash
# Run unit testes first (Jest) then run e2e tests (Playwright)
pnpm test

# Run unit tests only
pnpm test:unit

# Run e2e tests only
pnpm test:e2e
```

> There is a factory folder for creating database records for testing. Take a look at `@/factories`. `faker` is used to generate random data.

# Build

```bash
# build for production locally
pnpm build

# then, Start from build locally
pnpm start
```

# Tools

## Sign In

Add a new ADMIN user with Prisma studio, can be any valid email.

Use Mailcatcher (a local SMTP server with UI) http://localhost:1080 provided within docker-compose.yml to sign in.

## Prisma

```bash
# Prisma Studio (UI for Prisma)
npx prisma studio

# Migration (After changing schema.prisma)
npx prisma migrate dev

# Migration Reset (Force reset database)
npx prisma migrate reset
```

More at: https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-cli

## Redis CLI

```bash
# Redis CLI
pnpm cache
```

## Swagger and HTTP API

Authenticate on Swagger by generating a API key with `Prisma Studio`

![key](docs/apikey.png)

Then, go to http://localhost:3000/swagger and paste the key on the `Authorize` button.

![swagger](docs/swagger.png)

> The key must be passed on the `Authorization` header when calling the API externally when an endpoint is protected.

```bash
 # curl example
 curl -X 'GET' \
  'http://localhost:3000/api/all' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer clflwni3q0001v20i6hmz0dvj'
```
