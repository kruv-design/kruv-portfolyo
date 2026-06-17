import { expect, test } from "@playwright/test";
import {
  setAnalyticsConsent,
  waitQuiet,
  watchTrackRequests,
} from "./helpers/analytics";

test.describe("Site analitiği — consent & track", () => {
  test("consent reddedildiğinde /api/track gitmez", async ({ page }) => {
    await setAnalyticsConsent(page, "denied");
    const tracker = watchTrackRequests(page);

    await page.goto("/");
    await waitQuiet(2000);

    const worksLink = page.locator('a[href*="/works"]').first();
    if (await worksLink.isVisible()) {
      await worksLink.click();
      await page.waitForLoadState("networkidle");
      await waitQuiet(1500);
    }

    expect(tracker.payloads).toHaveLength(0);
    tracker.stop();
  });

  test("consent kabul edilince page_view gider", async ({ page }) => {
    await setAnalyticsConsent(page, "granted");
    const tracker = watchTrackRequests(page);

    await page.goto("/");
    const views = await tracker.waitForEvent("page_view");

    expect(views.length).toBeGreaterThan(0);
    expect(views[0]?.event_name).toBe("page_view");
    expect(views[0]?.session_id.length).toBeGreaterThan(0);
    tracker.stop();
  });

  test("SPA navigasyonda yeni page_view gelir", async ({ page }) => {
    await setAnalyticsConsent(page, "granted");
    const tracker = watchTrackRequests(page);

    await page.goto("/");
    await tracker.waitForEvent("page_view");
    const firstPage = tracker.payloads.at(-1)?.page;

    const worksLink = page.locator('a[href*="/works"]').first();
    await worksLink.click();
    await page.waitForURL(/\/works/);
    await tracker.waitForEvent("page_view");

    const pages = tracker.payloads
      .filter((p) => p.event_name === "page_view")
      .map((p) => p.page);

    expect(pages.some((p) => p.includes("works"))).toBe(true);
    if (firstPage) {
      expect(new Set(pages).size).toBeGreaterThan(1);
    }
    tracker.stop();
  });

  test("works grid proje kartı project_click gönderir", async ({ page }) => {
    await setAnalyticsConsent(page, "granted");
    const tracker = watchTrackRequests(page);

    await page.goto("/works");
    await tracker.waitForEvent("page_view");

    const card = page.locator("a.pw-card").first();
    await expect(card).toBeVisible();
    await card.click();
    await page.waitForURL(/\/projects\//);

    const clicks = await tracker.waitForEvent("project_click");
    expect(clicks[0]?.props?.slug).toBeTruthy();
    tracker.stop();
  });

  test("anasayfa featured kart project_click gönderir", async ({ page }) => {
    await setAnalyticsConsent(page, "granted");
    const tracker = watchTrackRequests(page);

    await page.goto("/");
    await tracker.waitForEvent("page_view");

    const hit = page.locator("a.featured-work-hit").first();
    if (!(await hit.count())) {
      test.skip(true, "Anasayfada featured proje kartı yok");
      return;
    }

    await hit.click();
    await page.waitForURL(/\/projects\//);

    const clicks = await tracker.waitForEvent("project_click");
    expect(clicks[0]?.props?.slug).toBeTruthy();
    tracker.stop();
  });

  test("contact form başarısız gönderimde event gitmez", async ({ page }) => {
    await setAnalyticsConsent(page, "granted");
    const tracker = watchTrackRequests(page);

    await page.goto("/contact");
    await tracker.waitForEvent("page_view");

    const submit = page.locator('button[type="submit"]').first();
    if (await submit.isVisible()) {
      await submit.click();
      await waitQuiet(2000);
    }

    expect(
      tracker.payloads.some((p) => p.event_name === "contact_form_submit"),
    ).toBe(false);
    tracker.stop();
  });

  test("contact form başarılı gönderimde contact_form_submit gider", async ({
    page,
  }) => {
    await setAnalyticsConsent(page, "granted");

    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    const tracker = watchTrackRequests(page);
    await page.goto("/contact");
    await tracker.waitForEvent("page_view");

    const name = page.locator('input[autocomplete="name"]').first();
    const email = page.locator('input[type="email"]').first();
    const message = page.locator("textarea").first();

    if (!(await name.isVisible())) {
      test.skip(true, "İletişim formu bu ortamda kapalı veya farklı layout");
      return;
    }

    await name.fill("Analytics Test");
    await email.fill("analytics-test@example.com");
    await message.fill("Playwright otomatik test — lütfen yoksayın.");

    await page.locator('button[type="submit"]').first().click();
    await tracker.waitForEvent("contact_form_submit");

    expect(
      tracker.payloads.some((p) => p.event_name === "contact_form_submit"),
    ).toBe(true);
    tracker.stop();
  });
});

test.describe("Track API doğrulama", () => {
  test("eksik alan 400 döner", async ({ request, baseURL }) => {
    const res = await request.post(`${baseURL}/api/track`, {
      data: { session_id: "test" },
    });
    expect(res.status()).toBe(400);
  });

  test("geçerli payload 200 veya 500 (tablo yoksa)", async ({
    request,
    baseURL,
  }) => {
    const res = await request.post(`${baseURL}/api/track`, {
      data: {
        session_id: "e2e-test-session",
        event_name: "e2e_ping",
        page: "/test",
        props: null,
        referrer: null,
      },
    });
    expect([200, 500]).toContain(res.status());
  });
});
