const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Ilkka Korhonen',
        username: 'iltelko',
        password: 'secret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText(/Login/)).toBeVisible()
    await expect(page.getByRole('button')).toBeVisible()
    await expect(page.getByRole('button')).toHaveText('login')

    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {

      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {

      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainenväärä')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new' }).click()
      await page.locator('#input_title').click()
      await page.locator('#input_title').fill('testataan koodin')
      await page.locator('#input_author').fill('generointia')
      await page.locator('#input_url').fill('www.google.fi')
      await page.getByRole('button', { name: 'Create' }).click()
      await page.getByText('testataan koodin').first().waitFor()
      await expect(page.getByText('testataan koodin').first()).toBeVisible()
    })

    test('blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new' }).click()
      await page.locator('#input_title').click()
      await page.locator('#input_title').fill('yksi')
      await page.locator('#input_author').fill('kaksi')
      await page.locator('#input_url').fill('kolme')
      await page.getByRole('button', { name: 'Create' }).click()
      await page.locator('div').filter({ hasText: /^yksi/ }).first().getByRole('button', { name: 'show' }).waitFor()
      await page.locator('div').filter({ hasText: /^yksi/ }).first().getByRole('button', { name: 'show' }).click()
      await page.locator('div').filter({ hasText: /kolme/ }).first().waitFor()
      await page.getByRole('button', { name: 'like' }).click()
      const sp = page.locator('span.blog_likes').getByText('likes 1').first()
      await sp.waitFor()
      await sp.isVisible()
    })

    test('blog can be removed only by author', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new' }).click()
      await page.locator('#input_title').click()
      await page.locator('#input_title').fill('seuraava')
      await page.locator('#input_author').fill('tämä')
      await page.locator('#input_url').fill('onkin tämä')
      await page.getByRole('button', { name: 'Create' }).click()

      await page.locator('span').filter({ hasText: 'seuraava' }).first().locator('..').getByRole('button', { name: 'show' }).click()

      const url = page.locator('p.blog_url').filter({ hasText: 'onkin tämä' }).first()

      await url.waitFor()
      await url.locator('..').getByRole('button', { name: 'remove' }).isVisible()

      await page.getByRole('button', { name: 'Logout' }).click()

      await page.getByTestId('username').waitFor()

      await page.getByTestId('username').fill('iltelko')
      await page.getByTestId('password').fill('secret')
      await page.getByRole('button', { name: 'login' }).click()

      const showBtn = page.locator('span').filter({ hasText: 'seuraava' }).first().locator('..').getByRole('button', { name: 'show' })
      await showBtn.waitFor()
      await showBtn.click()

      const url2 = page.locator('p.blog_url').filter({ hasText: 'onkin tämä' }).first()

      await url2.waitFor()

      expect(await url2.locator('..').getByRole('button', { name: 'remove' }).count()).toBe(0)
    })

    test('', async ({ page }) => {
      page.on('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'Create new' }).click()
      await page.locator('#input_title').click()
      await page.locator('#input_title').fill('poiston testausta')
      await page.locator('#input_author').fill('Jari Pelkonen')
      await page.locator('#input_url').fill('www.pelkonen.fi')
      await page.getByRole('button', { name: 'Create' }).click()

      const showBtn = page.locator('span').filter({ hasText: 'poiston testausta' }).first().locator('..').getByRole('button', { name: 'show' })
      await showBtn.waitFor()
      await showBtn.click()

      const url = page.locator('p.blog_url').filter({ hasText: 'www.pelkonen.fi' }).first()

      await url.waitFor()
      await url.locator('..').getByRole('button', { name: 'remove' }).click()


    })
  })
})