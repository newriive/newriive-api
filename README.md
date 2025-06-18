# newriive-api

Serverless backend for Newriive — powered by AWS Lambda, API Gateway, and DynamoDB.

## Monorepo Structure

- `lambdas/` — Lambda function implementations (each with `src/index.ts` and `tests/index.test.ts`)
- `packages/` — Shared code and utilities (each with `src/index.ts` and `tests/index.test.ts`)
- `terraform/` — Infrastructure as code
- `.env.example` — Example environment variables

## Development

- Use `pnpm` for managing workspaces and dependencies (install globally with `npm install -g pnpm`)
- Run `pnpm build` to compile all packages
- Run `pnpm test` to test all packages and lambdas
- Run `pnpm format` and `pnpm lint` for code quality

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
