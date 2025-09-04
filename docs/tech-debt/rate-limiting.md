# Technical Debt: Rate Limiting on Credit-Related APIs

## Issue

The API endpoints related to credit management (`/api/credits` and `/api/generate-image`) do not have rate limiting implemented. This poses a significant security risk, as identified in the QA review (`SEC-001: Credit Manipulation/Exploitation`).

Without rate limiting, these endpoints are vulnerable to:
-   **Brute-force attacks:** An attacker could rapidly try to guess user credentials or session tokens.
-   **Denial-of-service (DoS) attacks:** An attacker could overwhelm the server with a high volume of requests, potentially causing service disruption and incurring high costs.
-   **Resource abuse:** A malicious or compromised user account could consume an excessive amount of resources, such as database connections or image generation capacity.

## Blockers for Immediate Implementation

As the `dev` agent, I am blocked from implementing a robust, distributed rate limiting solution for the following reasons:

1.  **Infrastructure Requirements:** The most effective rate limiting solutions for a serverless environment (like Vercel, where this Next.js app is likely deployed) require an external, centralized store to track request counts across different serverless function instances. This typically involves setting up and configuring a service like Redis (e.g., via Upstash). This is an infrastructure-level change that is outside the scope of my current role.
2.  **Database Schema Changes:** An alternative approach would be to use the existing Supabase database to store request logs. However, this would require creating a new table (e.g., `api_request_logs`), which is a database schema change. Schema changes are architectural decisions that should be handled by the `architect` or `db-admin` role and go through a proper review and migration process.

## Recommended Solutions

When this technical debt is prioritized, one of the following solutions should be implemented:

### 1. Vercel KV or Upstash Redis (Recommended)

-   **Library:** Use a library like `ratelimit` (`@upstash/ratelimit`).
-   **Implementation:**
    1.  Provision a Vercel KV or Upstash Redis instance.
    2.  Add the `@upstash/ratelimit` and `@vercel/kv` or `@upstash/redis` packages to the project.
    3.  Create a rate limiter instance, configuring the request limit and window (e.g., 10 requests per 10 seconds).
    4.  Wrap the API route handlers in `apps/web/app/api/credits/route.ts` and `apps/web/app/api/generate-image/route.ts` with the rate limiting logic.
-   **Pros:** Highly performant, designed for serverless environments, easy to implement in code once the infrastructure is in place.
-   **Cons:** Requires provisioning and managing an external service.

### 2. Database-Backed Solution

-   **Implementation:**
    1.  Create a new table in the Supabase database, e.g., `api_request_logs` with columns like `identifier` (user ID or IP address), `timestamp`.
    2.  Before processing a request in the API routes, query this table to count the number of requests from the identifier within the time window.
    3.  If the count exceeds the limit, return a 429 "Too Many Requests" error.
    4.  If the request is allowed, add a new entry to the log.
    5.  A cleanup job would be needed to periodically remove old log entries.
-   **Pros:** Keeps the solution within the existing Supabase stack.
-   **Cons:** Less performant than a dedicated in-memory store like Redis, adds load to the primary database, and requires more complex logic to implement correctly.

## Next Steps

1.  The **Product Owner** or **Architect** should review this technical debt and prioritize it in the backlog.
2.  Once prioritized, the necessary infrastructure (e.g., Redis) or database schema changes should be made.
3.  A new story should be created for the `dev` agent to implement the rate limiting logic in the code using the chosen solution.
