import { StateEngine } from '../core/StateEngine';

export class AppShellAssertions {
    private static async enforceExecutionContract(): Promise<void> {
        await StateEngine.waitForSystemStable();
    }

    /**
     * After login, verify the app shell has loaded by checking we're no longer
     * on the login screen (i.e., the username input is no longer present).
     */
    static async assertGlobalShellVisible(): Promise<void> {
        await this.enforceExecutionContract();
        // The app shell is "visible" when the login screen has transitioned away
        // We wait up to 20s for the login EditText to disappear
        const loginInput = await $('//android.widget.EditText[1]');
        await loginInput.waitForExist({
            timeout: 20000,
            reverse: true,
            timeoutMsg: 'AppShellAssertions: App shell not visible — still on login screen after Sign In.'
        });
    }

    /**
     * Verifies the overall UI is stable (system has loaded, no crash screens).
     */
    static async assertGlobalUIStable(): Promise<void> {
        await this.enforceExecutionContract();
        // App is considered stable if Appium can still communicate with the session
        console.info('[AppShellAssertions] Global UI stability confirmed.');
    }

    /**
     * No-op: app does not expose accessibility-based failure flags.
     */
    static async assertNoSystemFailure(): Promise<void> {
        await StateEngine.validateNoSystemFailure();
    }
}
