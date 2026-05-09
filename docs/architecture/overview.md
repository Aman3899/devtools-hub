# Architecture Overview

## Core Principles

- **Feature-First**: Logic is grouped by feature rather than type.
- **Clean Architecture**: Separation of UI, business logic (hooks/services), and state.
- **Enterprise-Grade UI**: Minimalist design with structured layouts.
- **Internationalization**: Full support for English and Urdu.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: Redux Toolkit (Client) + TanStack Query (Server)
- **Validation**: Zod
- **API Client**: Axios with Interceptors

## Directory Structure

```
src/
├── app/          # Next.js Routes
├── components/   # Shared UI & Layout
├── features/     # Feature-based modules (Logic + Components)
├── store/        # Redux Slices & Config
├── services/     # API Client & Global Services
├── providers/    # Context & State Providers
├── config/       # Constants & Theme Config
├── lib/          # Utilities
└── i18n/         # Localization Logic
```
