import { expect, test } from '@playwright/test'

test('宣传页展示产品价值、核心能力与真实演示视频', async ({ page, request }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('别让好机会')
  await expect(page.locator('.landing-hero').getByRole('link', { name: '了解产品能力' })).toHaveAttribute('href', '#features')
  await expect(page.locator('.hero-report__meta')).toContainText('示例数据 · 非真实调查结果')
  await expect(page.locator('#features')).toContainText('参展企业调查')
  await expect(page.locator('#workflow')).toContainText('建立企业画像')

  const video = page.getByLabel('展视产品演示视频')
  await expect(video).toHaveAttribute('controls', '')
  await expect(video).toHaveAttribute('src', '/product-demo.mp4')
  expect((await request.get('/product-demo.mp4')).ok()).toBe(true)
})

test('独立站按钮均为页内跳转且不包含联系方式', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.landing-header__cta')).toHaveAttribute('href', '#demo')
  await expect(page.locator('a[href="/app"]')).toHaveCount(0)
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0)
})

test('移动端导航可以打开、跳转并关闭', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.getByRole('button', { name: '菜单' }).click()
  const featuresLink = page.getByRole('navigation', { name: '主要导航' }).getByRole('link', { name: '核心能力' })
  await expect(featuresLink).toBeVisible()
  await featuresLink.click()

  await expect(page).toHaveURL(/#features$/)
  await expect(page.locator('#features')).toBeInViewport()
  await expect(featuresLink).not.toBeVisible()
})

test('导航会标记当前阅读章节', async ({ page }) => {
  await page.goto('/')
  await page.locator('#features').scrollIntoViewIfNeeded()

  await expect(page.getByRole('navigation', { name: '主要导航' }).getByRole('link', { name: '核心能力' })).toHaveAttribute('aria-current', 'true')
})

test('常见问题可以展开阅读', async ({ page }) => {
  await page.goto('/')
  const question = page.getByText('没有企查查账号，可以使用吗？', { exact: true })
  await question.click()

  await expect(page.getByText('可以。展视默认使用公开网页完成展会与企业调查。', { exact: false })).toBeVisible()
})


test('桌面和移动端都提供 ShowProof GitHub 入口', async ({ page }) => {
  await page.goto('/')

  const headerLink = page.locator('.landing-header__inner > .landing-github')
  await expect(headerLink).toHaveAttribute('href', 'https://github.com/ent-xjtlu/ShowProof')
  await expect(headerLink).toHaveAttribute('target', '_blank')
  await expect(headerLink).toHaveAttribute('rel', 'noreferrer')
  await expect(page.locator('.landing-footer').getByRole('link', { name: 'GitHub / ShowProof' })).toHaveAttribute('href', 'https://github.com/ent-xjtlu/ShowProof')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: '菜单' }).click()
  await expect(page.getByRole('navigation', { name: '主要导航' }).getByRole('link', { name: 'GitHub / ShowProof' })).toBeVisible()
})


test('英文模式翻译完整页面并记住语言选择', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to English' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Find the exhibitions')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle('ExVis | Find exhibitions worth showing up for')
  await expect(page.locator('#features')).toContainText('Exhibitor research')
  await expect(page.locator('#workflow')).toContainText('Build your company profile')
  await expect(page.locator('.hero-report__meta')).toContainText('Sample data · Not real research results')
  await expect(page.locator('#faq')).toContainText('Can I use ExVis without a QCC account?')

  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Find the exhibitions')
  await page.getByRole('button', { name: '切换到中文' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('别让好机会')
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN')
})

test('移动端菜单可以切换英文', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: '菜单' }).click()
  await page.getByRole('button', { name: 'Switch to English' }).click()

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Find the exhibitions')
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible()
})


test('英文长文案在不同宽度下不会覆盖功能卡底部标签', async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem('shizheng-language', 'en'))

  for (const width of [1440, 1024, 320]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const overlaps = await page.locator('.feature-card').evaluateAll((cards) => cards.flatMap((card) => {
      const description = card.querySelector('.feature-card__description')!.getBoundingClientRect()
      const noteElement = card.querySelector('.feature-card__note')!
      const note = noteElement.getBoundingClientRect()
      const noteTextTop = note.top + Number.parseFloat(getComputedStyle(noteElement).paddingTop)
      return description.bottom > noteTextTop - 6 ? [card.querySelector('h3')!.textContent] : []
    }))
    expect(overlaps, `viewport ${width}px`).toEqual([])
  }
})
