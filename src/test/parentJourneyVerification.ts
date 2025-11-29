/**
 * Parent Journey Verification Test
 * 
 * Programmatically verifies the complete parent user journey with detailed evidence logging.
 * Can be run directly in the browser console or integrated into system health checks.
 */

interface VerificationResult {
  step: string;
  passed: boolean;
  evidence: string;
  timestamp: number;
  error?: string;
}

interface JourneyReport {
  testName: string;
  startTime: number;
  endTime: number;
  totalSteps: number;
  passedSteps: number;
  failedSteps: number;
  results: VerificationResult[];
  overallPass: boolean;
}

class ParentJourneyVerifier {
  private results: VerificationResult[] = [];
  private startTime: number = 0;

  private log(step: string, passed: boolean, evidence: string, error?: string) {
    const result: VerificationResult = {
      step,
      passed,
      evidence,
      timestamp: Date.now(),
      error,
    };
    this.results.push(result);
    
    const emoji = passed ? '✅' : '❌';
    console.log(`${emoji} ${step}: ${evidence}`);
    if (error) console.error(`   Error: ${error}`);
  }

  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async verifyElement(
    selector: string,
    description: string,
    timeout: number = 5000
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element && element instanceof HTMLElement) {
        const isVisible = element.offsetParent !== null;
        if (isVisible) {
          return true;
        }
      }
      await this.wait(100);
    }
    
    return false;
  }

  private async verifyMultipleSelectors(
    selectors: string[],
    description: string,
    timeout: number = 5000
  ): Promise<HTMLElement | null> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element instanceof HTMLElement && element.offsetParent !== null) {
          return element;
        }
      }
      await this.wait(100);
    }
    
    return null;
  }

  async runCompleteJourney(): Promise<JourneyReport> {
    this.startTime = Date.now();
    this.results = [];
    
    console.group('🎯 Parent Journey Verification - Complete Flow');
    console.log('Starting comprehensive parent user journey test...\n');

    // STEP 1: Verify page load
    try {
      const isHome = window.location.pathname === '/' || window.location.pathname === '/home';
      this.log(
        'Step 1: Homepage Load',
        isHome,
        isHome ? 'User successfully landed on homepage' : `User on ${window.location.pathname}`,
        isHome ? undefined : 'Not on homepage'
      );
    } catch (error) {
      this.log('Step 1: Homepage Load', false, 'Failed to verify page', (error as Error).message);
    }

    await this.wait(500);

    // STEP 2: Verify Jubee mascot presence
    try {
      const jubeeExists = await this.verifyElement(
        '[data-jubee-canvas="true"], canvas',
        'Jubee mascot',
        3000
      );
      this.log(
        'Step 2: Jubee Mascot Visible',
        jubeeExists,
        jubeeExists 
          ? 'Jubee mascot is rendered and visible to parent' 
          : 'Jubee mascot not found in DOM',
        jubeeExists ? undefined : 'Mascot element missing'
      );
    } catch (error) {
      this.log('Step 2: Jubee Mascot Visible', false, 'Failed to verify', (error as Error).message);
    }

    await this.wait(500);

    // STEP 3: Wait for onboarding (it starts after 1s delay)
    await this.wait(1500);
    
    try {
      const onboardingElement = await this.verifyMultipleSelectors(
        ['[data-testid="onboarding"]', '[role="dialog"]', '.onboarding-tutorial'],
        'Onboarding tutorial'
      );
      
      const onboardingVisible = onboardingElement !== null;
      this.log(
        'Step 3: Onboarding Tutorial Appears',
        onboardingVisible,
        onboardingVisible 
          ? 'Onboarding tutorial displayed to first-time parent' 
          : 'Onboarding not found (may be disabled or already completed)',
        onboardingVisible ? undefined : 'Tutorial element not visible'
      );

      // STEP 4: Simulate parent clicking through onboarding
      if (onboardingVisible) {
        await this.wait(800);
        
        const nextButton = document.querySelector<HTMLElement>(
          'button:has-text("Next"), button:has-text("Continue"), button:has-text("Got it")'
        ) || Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent?.toLowerCase().includes('next') ||
          btn.textContent?.toLowerCase().includes('continue') ||
          btn.textContent?.toLowerCase().includes('got it')
        );

        if (nextButton && nextButton.offsetParent !== null) {
          nextButton.click();
          await this.wait(800);
          this.log(
            'Step 4: Progress Through Onboarding',
            true,
            'Parent clicked Next/Continue button'
          );
        } else {
          // Try skip button instead
          const skipButton = document.querySelector<HTMLElement>(
            'button:has-text("Skip"), button:has-text("Close")'
          ) || Array.from(document.querySelectorAll('button')).find(btn => 
            btn.textContent?.toLowerCase().includes('skip') ||
            btn.textContent?.toLowerCase().includes('close')
          );

          if (skipButton && skipButton.offsetParent !== null) {
            skipButton.click();
            await this.wait(500);
            this.log(
              'Step 4: Complete Onboarding',
              true,
              'Parent skipped/closed onboarding tutorial'
            );
          }
        }
      }
    } catch (error) {
      this.log('Step 3-4: Onboarding Flow', false, 'Failed to verify', (error as Error).message);
    }

    await this.wait(1000);

    // STEP 5: Navigate to Stories
    try {
          const storiesLink = document.querySelector<HTMLElement>(
        'a[href*="/stories"], nav a:has-text("Stories")'
      ) || Array.from(document.querySelectorAll('a, button')).find(el => 
        el.textContent?.toLowerCase().includes('stories') ||
        (el instanceof HTMLAnchorElement && el.href.includes('/stories'))
      ) as HTMLElement | undefined;

      const storiesLinkExists = storiesLink !== undefined && storiesLink instanceof HTMLElement && storiesLink.offsetParent !== null;
      this.log(
        'Step 5: Stories Navigation Available',
        storiesLinkExists,
        storiesLinkExists 
          ? 'Stories navigation button found and visible' 
          : 'Stories navigation not found',
        storiesLinkExists ? undefined : 'Navigation element missing'
      );

      if (storiesLinkExists && storiesLink) {
        storiesLink.click();
        await this.wait(1500);
        
        const onStoriesPage = window.location.pathname.includes('/stories');
        this.log(
          'Step 6: Navigate to Stories Page',
          onStoriesPage,
          onStoriesPage 
            ? `Successfully navigated to ${window.location.pathname}` 
            : 'Failed to navigate to stories',
          onStoriesPage ? undefined : `Still on ${window.location.pathname}`
        );

        if (onStoriesPage) {
          // STEP 7: Verify story library loads
          await this.wait(1000);
          
          const storyCards = document.querySelectorAll('[data-testid="story-card"], .story-card');
          const storyCardsExist = storyCards.length > 0;
          
          this.log(
            'Step 7: Story Library Loads',
            storyCardsExist,
            storyCardsExist 
              ? `Parent sees ${storyCards.length} available stories` 
              : 'No story cards found in library',
            storyCardsExist ? undefined : 'Story cards not rendered'
          );

          // STEP 8: Select first story
          if (storyCardsExist) {
            const firstStory = storyCards[0];
            if (!(firstStory instanceof HTMLElement)) {
              // Skip to report generation if element is invalid
              const report: JourneyReport = {
                testName: 'Parent User Journey - Complete Flow',
                startTime: this.startTime,
                endTime: Date.now(),
                totalSteps: this.results.length,
                passedSteps: this.results.filter(r => r.passed).length,
                failedSteps: this.results.filter(r => !r.passed).length,
                results: this.results,
                overallPass: this.results.filter(r => r.passed).length >= this.results.length * 0.7,
              };
              console.groupEnd();
              return report;
            }
            
            const storyTitle = firstStory.querySelector('h2, h3, [class*="title"]')?.textContent || 'Unknown';
            
            firstStory.click();
            await this.wait(1500);
            
            const onStoryReader = window.location.pathname.match(/\/stories\/.+/);
            this.log(
              'Step 8: Select Story',
              !!onStoryReader,
              onStoryReader 
                ? `Parent opened story: "${storyTitle}"` 
                : 'Failed to open story reader',
              onStoryReader ? undefined : 'Story reader did not load'
            );

            if (onStoryReader) {
              // STEP 9: Verify story content loads
              const storyText = await this.verifyMultipleSelectors(
                ['[data-testid="story-text"]', '.story-content', 'p'],
                'Story text content'
              );
              
              this.log(
                'Step 9: Story Content Loads',
                !!storyText,
                storyText 
                  ? 'Story text content rendered successfully' 
                  : 'Story text not found',
                storyText ? undefined : 'Content element missing'
              );

              // STEP 10: Verify audio controls
              const audioControls = await this.verifyMultipleSelectors(
                ['button[aria-label*="play"]', 'button[aria-label*="audio"]', 'audio'],
                'Audio controls'
              );
              
              this.log(
                'Step 10: Audio Narration Available',
                !!audioControls,
                audioControls 
                  ? 'Audio narration controls present for read-aloud' 
                  : 'Audio controls not found',
                audioControls ? undefined : 'Audio elements missing'
              );

              // STEP 11: Verify navigation controls
              const navControls = await this.verifyMultipleSelectors(
                ['button:has-text("Next")', '[aria-label*="next"]', '.page-indicator'],
                'Navigation controls'
              );
              
              this.log(
                'Step 11: Story Navigation Controls',
                !!navControls,
                navControls 
                  ? 'Page navigation controls available' 
                  : 'Navigation controls not found',
                navControls ? undefined : 'Navigation elements missing'
              );
            }
          }
        }
      }
    } catch (error) {
      this.log('Step 5-11: Stories Navigation', false, 'Failed to verify', (error as Error).message);
    }

    // Generate report
    const report: JourneyReport = {
      testName: 'Parent User Journey - Complete Flow',
      startTime: this.startTime,
      endTime: Date.now(),
      totalSteps: this.results.length,
      passedSteps: this.results.filter(r => r.passed).length,
      failedSteps: this.results.filter(r => !r.passed).length,
      results: this.results,
      overallPass: this.results.filter(r => r.passed).length >= this.results.length * 0.7, // 70% pass rate
    };

    console.log('\n📊 Journey Verification Summary');
    console.log('='.repeat(50));
    console.log(`Total Steps: ${report.totalSteps}`);
    console.log(`✅ Passed: ${report.passedSteps}`);
    console.log(`❌ Failed: ${report.failedSteps}`);
    console.log(`Duration: ${report.endTime - report.startTime}ms`);
    console.log(`Overall Result: ${report.overallPass ? '✅ PASS' : '❌ FAIL'}`);
    console.groupEnd();

    return report;
  }

  async runQuickJourney(): Promise<JourneyReport> {
    this.startTime = Date.now();
    this.results = [];
    
    console.group('⚡ Parent Journey Verification - Quick Flow');
    console.log('Testing impatient parent who skips onboarding...\n');

    // Quick navigation test
    try {
      // Step 1: Navigate directly to stories
      window.location.href = '/stories';
      await this.wait(2000);
      
      const onStoriesPage = window.location.pathname.includes('/stories');
      this.log(
        'Quick Step 1: Direct Stories Navigation',
        onStoriesPage,
        onStoriesPage ? 'Parent bypassed onboarding, went straight to stories' : 'Navigation failed'
      );

      if (onStoriesPage) {
        // Step 2: Verify stories load
        const storyCards = document.querySelectorAll('[data-testid="story-card"], .story-card');
        const storyCardsExist = storyCards.length > 0;
        
        this.log(
          'Quick Step 2: Story Library Quick Load',
          storyCardsExist,
          storyCardsExist ? `Quickly found ${storyCards.length} stories` : 'Stories not loaded'
        );

        if (storyCardsExist) {
          // Step 3: Quick story preview
          (storyCards[0] as HTMLElement).click();
          await this.wait(1500);
          
          const storyText = await this.verifyMultipleSelectors(
            ['[data-testid="story-text"]', '.story-content', 'p'],
            'Story content'
          );
          
          this.log(
            'Quick Step 3: Story Preview',
            !!storyText,
            storyText ? 'Story loaded for quick preview' : 'Story failed to load'
          );
        }
      }
    } catch (error) {
      this.log('Quick Journey', false, 'Failed', (error as Error).message);
    }

    const report: JourneyReport = {
      testName: 'Parent User Journey - Quick Flow',
      startTime: this.startTime,
      endTime: Date.now(),
      totalSteps: this.results.length,
      passedSteps: this.results.filter(r => r.passed).length,
      failedSteps: this.results.filter(r => !r.passed).length,
      results: this.results,
      overallPass: this.results.filter(r => r.passed).length === this.results.length,
    };

    console.log('\n📊 Quick Journey Summary');
    console.log(`Passed: ${report.passedSteps}/${report.totalSteps}`);
    console.log(`Result: ${report.overallPass ? '✅ PASS' : '❌ FAIL'}`);
    console.groupEnd();

    return report;
  }

  getDetailedReport(): string {
    if (this.results.length === 0) {
      return 'No test results available. Run a journey test first.';
    }

    let report = '\n📋 DETAILED EVIDENCE REPORT\n';
    report += '='.repeat(60) + '\n\n';

    this.results.forEach((result, index) => {
      report += `${index + 1}. ${result.step}\n`;
      report += `   Status: ${result.passed ? '✅ PASS' : '❌ FAIL'}\n`;
      report += `   Evidence: ${result.evidence}\n`;
      report += `   Timestamp: ${new Date(result.timestamp).toISOString()}\n`;
      if (result.error) {
        report += `   Error: ${result.error}\n`;
      }
      report += '\n';
    });

    return report;
  }
}

// Export singleton instance
export const parentJourneyVerifier = new ParentJourneyVerifier();

// Make available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).verifyParentJourney = async () => {
    const report = await parentJourneyVerifier.runCompleteJourney();
    console.log('\n' + parentJourneyVerifier.getDetailedReport());
    return report;
  };

  (window as any).verifyQuickJourney = async () => {
    const report = await parentJourneyVerifier.runQuickJourney();
    console.log('\n' + parentJourneyVerifier.getDetailedReport());
    return report;
  };
}
