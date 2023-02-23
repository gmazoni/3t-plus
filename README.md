# Next.js, NextAuth.js, tRPC, superjson, Zod, Prisma, trpc-openapi

Made with:

- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [tailwindcss](https://tailwindcss.com/)
- [tRPC](https://trpc.io/)
- [Zod](https://zod.dev/)
- [Prisma](https://www.prisma.io/)
- [trpc-openapi](https://github.com/jlalmes/trpc-openapi)
- [superjson](https://github.com/blitz-js/superjson)

## Install

```bash
git clone ...
cd 3t-plus

# Install dependencies
yarn

# Build Prisma Client
npx prisma generate

# Sync Prisma Schema with Server (Indexes, etc.)
npx prisma db push

# Seed DB with user teste@teste.com
yarn seed

#for pre-commit hook (Optional)
husk install
```

### Development server

```bash
yarn dev
```

### Build

```bash
yarn build
```

### Start from build

Must have built the app first.

```bash
yarn start
```
