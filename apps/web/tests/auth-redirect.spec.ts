// Playwright E2E placeholder for auth redirects
// These tests assume a running dev server and test helpers to seed a session.

import { test, expect } from '@playwright/test'

test.describe('Auth redirects', () => {
  test('unauthenticated user visiting / is redirected to /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('authenticated user visiting /login is redirected to /', async ({ page }) => {
    // TODO: Seed Supabase session cookies before navigation
    test.skip(true, 'Session seeding not implemented in test env')
    await page.goto('/login')
    await expect(page).toHaveURL('/')
  })
})

