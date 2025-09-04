# Coding Standards

## Code Formatting
- **Formatter**: Prettier will be used to automatically format the entire codebase. A `.prettierrc` configuration file will be in the root directory.

## Linting
- **Linter**: ESLint will be used to catch common errors and enforce best practices. Configurations will be set up for both frontend (React) and backend (Node.js) code.

## Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Files**: kebab-case (e.g., `user-service.ts`)
- **Variables/Functions**: camelCase (e.g., `getUserProfile`)

## Testing
- **Unit/Component Tests**: Vitest + React Testing Library. Test files should be co-located with the source files, using a `*.test.ts(x)` naming convention.
- **E2E Tests**: Playwright. E2E tests will live in a separate `tests/` directory at the root of the `apps/web` project.
