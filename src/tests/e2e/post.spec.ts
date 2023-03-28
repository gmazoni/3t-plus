import { expect, test } from '@playwright/test'

test.describe(() => {
  test.use({ storageState: 'states/ADMIN_STATE.json' }) //Act as admin
  //test.use({ storageState: 'states/SUPERVISOR_STATE.json' }) //Act as supervisor
  //test.use({ storageState: 'states/USER_STATE.json' }) //Act as user

  test('create post', async ({ page }) => {
    await page.goto('/')

    await page.click('text=Create new post')

    await expect(page).toHaveURL('/posts/new')

    await expect(page.locator('h4')).toContainText('Create posts')

    await page.fill('input[name="title"]', 'My First Post')
    await page.fill('input[name="body"]', 'Hello World!!!')

    await page.click('text=Salvar')

    await expect(page.locator('text=My First Post')).toBeVisible()
  })
})
