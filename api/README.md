# API

This directory is reserved for heavier hosted or service-oriented endpoints that do not belong inside the lightweight Next.js route handlers in `app/src/app/api/`.

It is intentionally minimal right now.

## Intended Use

Examples of workloads that may eventually live here:

- model-heavy inference endpoints
- background processing and report generation
- higher-volume hosted Water Intelligence API services
- partner-specific integrations

Until then, the public product routes live inside the app layer.
