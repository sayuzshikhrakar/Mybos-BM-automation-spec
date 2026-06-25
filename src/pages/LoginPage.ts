import { BasePage } from './BasePage';

/**
 * LoginPage.ts
 * Page Object for the MYBOS BM Login Screen.
 * Uses real XPath selectors based on the actual app UI.
 */
export class LoginPage extends BasePage {
    constructor() {
        // No screen root identifier needed - we wait for system stability
        super('');
    }

    // Native UiAutomator2 selectors — works in NATIVE_APP context
    // username: first EditText on screen
    get usernameInput() { return '//android.widget.EditText[1]'; }
    // password: UiAutomator selector by instance index (more reliable than XPath index after keyboard open)
    get passwordInput() { return '-android uiautomator:new UiSelector().className("android.widget.EditText").instance(1)'; }
    // Sign In button matched by native resource-id (provided by Appium inspector)
    get submitBtn()     { return '//*[@resource-id="loginBtn"]'; }
    get forgotPassword(){ return '//*[@text="Forgot password?"]'; }

    /**
     * Ensures the login screen is the active root before proceeding.
     */
    async openLoginScreen(): Promise<void> {
        // Wait for the app/WebView to stabilize
        await this.waitForScreenReady();
        // Verify the login form is actually on screen
        await this.verifyScreen();
    }

    /**
     * Overrides verifyScreen to validate the login page key elements.
     */
    override async verifyScreen(): Promise<void> {
        await super.verifyScreen();
        // Wait for the first EditText (username) to appear as proxy for login screen readiness
        const emailInput = await $('//android.widget.EditText[1]');
        await emailInput.waitForExist({
            timeout: 20000,
            timeoutMsg: 'LoginPage: Username input not found. App may not be on Login screen.'
        });
    }

    /**
     * Executes the login flow.
     */
    async login(username: string, pass: string): Promise<void> {
        await this.input(this.usernameInput, username);
        await this.input(this.passwordInput, pass);
        
        // 1. Safely tap the Sign In button using raw coordinate injection!
        // We MUST use raw coordinates because the Android GestureController crashes on this specific element's internal bounds via standard .click().
        // Now that "USB Debugging (Security settings)" is enabled, this raw injection will succeed!
        console.info('[Authentication] Tapping Sign In button via raw coordinate injection...');
        
        // Wait briefly for keyboard to stabilize if it popped up natively
        if (driver.isAndroid) {
            await driver.pause(1000);
        }

        const btn = await $(this.submitBtn);
        const location = await btn.getLocation();
        const size = await btn.getSize();
        
        const clickX = Math.round(location.x + size.width / 2);
        const clickY = Math.round(location.y + size.height / 2);

        await driver.performActions([{
            type: 'pointer',
            id: 'finger_submit',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: clickX, y: clickY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerUp', button: 0 }
            ]
        }]);
        await driver.releaseActions();
    }

    /**
     * Smart authentication flow:
     * 1. If already logged in (Dashboard visible), bypasses login.
     * 2. If not logged in, performs credentials entry and signs in.
     */
    async ensureAuthenticated(username: string, pass: string): Promise<void> {
        console.info('[Authentication] Checking current application state...');
        const emailInput = await $(this.usernameInput);
        
        let isOnLoginScreen = false;
        let isOnDashboard = false;

        // Wait dynamically for either the Login Screen or the Dashboard to fully render
        try {
            await driver.waitUntil(async () => {
                isOnLoginScreen = await emailInput.isExisting();
                isOnDashboard = await $('~Home').isExisting();
                return isOnLoginScreen || isOnDashboard;
            }, {
                timeout: 20000,
                timeoutMsg: '[Authentication] App timed out waiting for either the Login Screen or the Dashboard to load.'
            });
        } catch (e: any) {
            console.error('[Authentication] TIMEOUT! Dumping page source to see what screen we are stuck on:');
            console.error(await driver.getPageSource());
            throw e;
        }

        if (isOnLoginScreen) {
            console.info('[Authentication] App is on Login Screen. Performing login flow.');
            await this.login(username, pass);
        } else {
            console.info('[Authentication] App is NOT on Login Screen. Dashboard detected (already logged in).');
        }
    }

    /**
     * Validates a successful login transition.
     */
    async verifyLoginSuccess(): Promise<void> {
        // After login, the email input should no longer be visible
        const emailInput = await $(this.usernameInput);
        await emailInput.waitForDisplayed({
            timeout: 20000,
            reverse: true,
            timeoutMsg: 'LoginPage: Still on login screen after login attempt.'
        });
    }

    /**
     * Validates a failed login attempt.
     */
    async verifyLoginFailure(): Promise<void> {
        // On failure, an error message or the form stays visible
        const emailInput = await $(this.usernameInput);
        await emailInput.waitForDisplayed({ timeout: 10000 });
    }
}

export default new LoginPage();
