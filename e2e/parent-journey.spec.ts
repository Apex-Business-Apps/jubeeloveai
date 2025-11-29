import { test, expect } from '@playwright/test';

/**
 * Parent User Journey: First-Time Experience
 * 
 * Models the journey of a non-technical parent exploring Jubee.Love for the first time.
 * Uses test.step for structured logging and robust selectors for resilience.
 */

test.describe('Parent User Journey: First-Time Experience', () => {
  
  test.beforeEach(async ({ context, page }) => {
    // Simulate first-time user - clear all stored data
    await context.clearCookies();
    await context.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await test.step('Parent arrives at homepage', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/');
    });
  });

  test('Complete journey: onboarding → story selection → full story reading', async ({ page }) => {
    await test.step('Onboarding appears automatically', async () => {
      // Wait for onboarding to appear (starts after 1s delay)
      const onboarding = page.locator('[data-testid="onboarding"]');
      await expect(onboarding).toBeVisible({ timeout: 5000 });
    });

    await test.step('Parent progresses through onboarding', async () => {
      const nextButton = page.getByRole('button', { name: /next|continue|got it/i });
      
      // Progress through up to 5 onboarding steps
      for (let i = 0; i < 5; i++) {
        const isVisible = await nextButton.isVisible().catch(() => false);
        if (!isVisible) break;
        
        await nextButton.click();
        await page.waitForTimeout(800);
      }
      
      // Close/skip onboarding if available
      const skipButton = page.getByRole('button', { name: /skip|close/i });
      const skipVisible = await skipButton.isVisible().catch(() => false);
      
      if (skipVisible) {
        await skipButton.click();
        await page.waitForTimeout(500);
      }
    });

    await test.step('Parent navigates to Stories section', async () => {
      const storiesLink = page.getByRole('link', { name: /stories/i }).or(
        page.getByRole('button', { name: /stories/i })
      );
      await expect(storiesLink).toBeVisible({ timeout: 5000 });
      await storiesLink.click();
      
      await expect(page).toHaveURL(/\/stories/);
    });

    await test.step('Parent sees story library', async () => {
      await expect(page.getByRole('heading', { name: /stories/i })).toBeVisible({ timeout: 5000 });
      
      const storyCards = page.locator('[data-testid="story-card"]');
      await expect(storyCards.first()).toBeVisible({ timeout: 5000 });
      
      const count = await storyCards.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('Parent selects a story', async () => {
      const firstStory = page.locator('[data-testid="story-card"]').first();
      await firstStory.click();
      
      await expect(page).toHaveURL(/\/stories\/.+/);
    });

    await test.step('Story content and audio controls are available', async () => {
      const storyText = page.locator('[data-testid="story-text"]');
      await expect(storyText).toBeVisible({ timeout: 5000 });
      
      // Check for audio controls (play, pause, audio element, or narration indicator)
      const audioControls = page.locator('button[aria-label*="play" i], button[aria-label*="pause" i], button[aria-label*="audio" i], audio, [class*="narrat"]');
      const hasAudio = await audioControls.count() > 0;
      expect(hasAudio).toBeTruthy();
    });

    await test.step('Parent navigates through story pages', async () => {
      const nextButton = page.getByRole('button', { name: /next/i });
      const pageIndicator = page.locator('[data-testid="page-number"]');
      
      // Verify navigation controls exist
      const hasNextButton = await nextButton.isVisible().catch(() => false);
      const hasPageIndicator = await pageIndicator.isVisible().catch(() => false);
      
      expect(hasNextButton || hasPageIndicator).toBeTruthy();
      
      // Navigate through a few pages if possible
      if (hasNextButton) {
        for (let i = 0; i < 3; i++) {
          const stillVisible = await nextButton.isVisible().catch(() => false);
          if (!stillVisible) break;
          
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });

    await test.step('Parent returns to story library', async () => {
      const backButton = page.getByRole('button', { name: /back/i }).or(
        page.getByRole('link', { href: '/stories' })
      );
      
      const backVisible = await backButton.isVisible().catch(() => false);
      if (backVisible) {
        await backButton.click();
        
        // Verify return to library
        const storyCards = page.locator('[data-testid="story-card"]');
        await expect(storyCards.first()).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test('Variant: onboarding skip → quick story preview', async ({ page }) => {
    await test.step('Parent skips onboarding immediately', async () => {
      const skipButton = page.getByRole('button', { name: /skip|close/i });
      const visible = await skipButton.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (visible) {
        await skipButton.click();
        await page.waitForTimeout(500);
      }
    });

    await test.step('Quick navigation to stories', async () => {
      await page.goto('/stories');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Parent selects and views a story quickly', async () => {
      const firstStory = page.locator('[data-testid="story-card"]').first();
      await expect(firstStory).toBeVisible({ timeout: 5000 });
      
      await firstStory.click();
      
      const storyContent = page.locator('[data-testid="story-text"]');
      await expect(storyContent).toBeVisible({ timeout: 5000 });
    });
  });

  test('Variant: onboarding → explore multiple sections → settle on stories', async ({ page }) => {
    await test.step('Parent completes onboarding quickly', async () => {
      const skipButton = page.getByRole('button', { name: /skip|close/i });
      const visible = await skipButton.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (visible) {
        await skipButton.click();
        await page.waitForTimeout(500);
      }
    });

    await test.step('Parent explores different sections', async () => {
      const sections = ['/games', '/write', '/stickers', '/stories'];
      
      for (const section of sections) {
        await page.goto(section);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }
    });

    await test.step('Parent settles on stories section', async () => {
      // Should already be on /stories from exploration loop
      const storyCard = page.locator('[data-testid="story-card"]').first();
      await expect(storyCard).toBeVisible({ timeout: 5000 });
      
      await storyCard.click();
      
      const storyText = page.locator('[data-testid="story-text"]');
      await expect(storyText).toBeVisible({ timeout: 5000 });
    });
  });
});
