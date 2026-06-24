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
    // Sign In button matched by visible text
    get submitBtn()     { return '//*[@text="Sign In"]'; }
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
        await this.tap(this.submitBtn);
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
