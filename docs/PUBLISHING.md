# Publishing forked Amplify packages

This repo contains forked Amplify packages under the `@connexion-mobility-ltd` scope (for example:

- `@connexion-mobility-ltd/aws-amplify-core`
- `@connexion-mobility-ltd/aws-amplify-analytics`
- other packages under `packages/`

This document describes how to bump and publish a new version of one of these packages (for example `packages/analytics` or `packages/core`).

## 1. Install dependencies in the repo root

From the repo root:

```bash
cd /Users/romeoenso/Desktop/code/amplify-js
npm install --legacy-peer-deps
```

Notes:

- We use `npm` (not `yarn`) in this forked repo.
- `--legacy-peer-deps` avoids strict peer-dependency resolution issues (for example around `eslint`).

You only need to do this once per environment, or when dependencies change.

## 2. Choose the package to update

Each package lives under `packages/` and has its own `package.json`. Examples:

- Core: `packages/core/package.json` (`@connexion-mobility-ltd/aws-amplify-core`)
- Analytics: `packages/analytics/package.json` (`@connexion-mobility-ltd/aws-amplify-analytics`)

Decide which package you are updating, then either:

```bash
# Option A: work in the package directory
cd packages/analytics
```

or use npm workspaces from the repo root (see commands below).

## 3. Bump the version

You **must** publish a new version number that does not already exist on npm. You cannot overwrite an existing version.

From the package directory (example: analytics):

```bash
cd /Users/romeoenso/Desktop/code/amplify-js/packages/analytics
npm version patch
```

This will:

- Increment the version in `package.json` (e.g. `7.0.69` → `7.0.70`).
- Create a git tag locally (you can push it later if desired).

If you prefer, you can use `npm version minor` or `npm version major` depending on the type of change.

To confirm that the new version is not already published:

```bash
npm view @connexion-mobility-ltd/aws-amplify-analytics versions
```

Check that the version in `package.json` is **not** in that list.

## 4. Commit your changes

Before publishing, make sure your version bumps and code changes are committed to git so the repo state matches what you publish to npm:

```bash
git status
git add .
git commit -m "chore: bump analytics to 7.0.70"
```

You can adjust the commit message and scope (analytics, core, etc.) as needed.

## 5. Build the package

Each package exposes an `npm run build` script that builds the distributable artifacts under `dist/`.

From the package directory (recommended):

```bash
cd /Users/romeoenso/Desktop/code/amplify-js/packages/analytics
npm run build
```

Alternatively, from the repo root using npm workspaces:

```bash
cd /Users/romeoenso/Desktop/code/amplify-js
npm run build --workspace @connexion-mobility-ltd/aws-amplify-analytics
```

The build should complete without errors and generate up-to-date `dist/cjs` and `dist/esm` outputs that match the `main`, `module`, and `typings` fields in the package's `package.json`.

## 6. Ensure you have npm publishing credentials

To publish under the `@connexion-mobility-ltd` scope you need:

- An npm account with publish permissions for the scope.
- 2FA set up if the organization requires it.

Log in from the terminal (once per environment):

```bash
npm login
```

You can verify your identity with:

```bash
npm whoami
```

## 7. Publish the package to npm

From the **package directory** you just built (for example `packages/analytics`):

```bash
cd /Users/romeoenso/Desktop/code/amplify-js/packages/analytics
npm publish --access public
```

Notes:

- `--access public` is required for scoped packages that should be publicly accessible.
- If you see an error like `Cannot publish over previously published version`, it means that version already exists. Go back to step 3, bump the version again, rebuild, and retry.

As an alternative, you can publish using workspaces from the root:

```bash
cd /Users/romeoenso/Desktop/code/amplify-js
npm publish --workspace @connexion-mobility-ltd/aws-amplify-analytics --access public
```

## 8. Verify the published version

After a successful publish, verify that the new version is available on npm:

```bash
npm view @connexion-mobility-ltd/aws-amplify-analytics version
npm view @connexion-mobility-ltd/aws-amplify-analytics versions
```

You should see your new version as the latest, and in the versions list.

## 9. Using the published package in another project

In a consuming project, install the published packages with a version that exists on npm, for example:

```bash
npm install \
  @connexion-mobility-ltd/aws-amplify-core@^6.7.4 \
  @connexion-mobility-ltd/aws-amplify-analytics@^7.0.69
```

Then import and configure as you would with the upstream Amplify packages, but using the `@connexion-mobility-ltd` scope.
