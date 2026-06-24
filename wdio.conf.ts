import type { Options } from '@wdio/types';
import { browser, driver } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import { SessionManager } from './src/core/engine/SessionManager';
import { ContractValidator } from './src/core/engine/ContractValidator';

export const config: Options.Testrunner = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true
        }
    },

    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './src/tests/**/*.spec.ts'
    ],
    exclude: [
        './src/tests/ContractAudit.spec.ts',
        './src/tests/ContractCompliance.spec.ts',
        './src/tests/LocatorAudit.spec.ts',
        './src/tests/ScreenRootAudit.spec.ts',
        './src/tests/ContractTestSuite.spec.ts',
        './src/tests/GlobalState.spec.ts',
        './src/tests/StateHookIntegrity.spec.ts',
        './src/tests/DuplicateIdentifierScanner.ts'
    ],

    //
    // ============
    // Capabilities
    // ============
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': process.env.TARGET_DEVICE === 'emulator' ? 'Genymotion Emulator' : 'Android Device',
        ...(process.env.TARGET_DEVICE === 'emulator' ? {} : { 'appium:udid': 'PRVKMJCEJ7PZGM69' }),
        'appium:automationName': 'UiAutomator2',
        'appium:noSign': true,
        'appium:appPackage': 'com.mybosapps.bmapp.stg',
        'appium:appActivity': 'com.mybosapps.bmapp.MainActivity',
        'appium:appWaitActivity': 'com.mybosapps.bmapp.MainActivity',
        'appium:newCommandTimeout': 240,
        'appium:noReset': true,
        'appium:chromedriverAutodownload': true,
        'appium:ignoreHiddenApiPolicyError': true
    } as any],

    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 1, // Immediately terminate execution on first HARD FAIL
    baseUrl: 'http://localhost',

    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ['appium'],

    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false
        }]
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 120000 // Extended timeout for extensive appium init and contract validations
    },

    //
    // =====
    // Hooks
    // =====

    /**
     * Gets executed once before all workers get launched.
     */
    onPrepare: function (config, capabilities) {
        const fs = require('fs');
        const resultsDir = './allure-results';
        const reportDir = './allure-report';
        if (fs.existsSync(resultsDir)) {
            fs.rmSync(resultsDir, { recursive: true, force: true });
        }
        if (fs.existsSync(reportDir)) {
            fs.rmSync(reportDir, { recursive: true, force: true });
        }
    },

    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     */
    before: async function (capabilities, specs) {
        console.info('[BOOTSTRAP] Starting Framework Initialization and Validation...');
        try {
            console.info('[BOOTSTRAP] -> Executing SessionManager.frameworkStartup() (App Launch & System Stability)');
            await SessionManager.frameworkStartup();
            console.info('[BOOTSTRAP] -> SessionManager Initialization Complete. System is Stable.');

            // console.info('[BOOTSTRAP] -> Executing ContractValidator.validateAppShell() and validateSystemHooks()');
            // await ContractValidator.validateAppShell();
            // await ContractValidator.validateSystemHooks();
            console.info('[BOOTSTRAP] -> Framework Validation Bypassed. Proceeding to tests.');

        } catch (error: any) {
            console.error(`[BOOTSTRAP] ❌ HARD FAIL DETECTED: ${error.message}`);
            // Take screenshot on bootstrap failure for CI artifact debugging
            try {
                const screenshot = await driver.takeScreenshot();
                allureReporter.addAttachment('Bootstrap Failure Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
            } catch (screenshotError) {
                console.error('[BOOTSTRAP] Failed to take failure screenshot:', screenshotError);
            }
            // Immediately terminate execution
            throw error;
        }
    },

    /**
     * Function to be executed after a test (in Mocha/Jasmine) ends.
     */
    afterTest: async function (test, context, { error, passed }) {
        if (!passed) {
            const screenshot = await driver.takeScreenshot();
            allureReporter.addAttachment(
                'Failure Screenshot',
                Buffer.from(screenshot, 'base64'),
                'image/png'
            );
        }
    },

    /**
     * Gets executed after all workers got shut down and the process is about to exit.
     */
    onComplete: function(exitCode, config, capabilities, results) {
        const { execSync } = require('child_process');
        try {
            console.info('\n================================================================');
            console.info('[REPORT] Automatically generating Allure Report...');
            console.info('================================================================');
            execSync('npm run report', { stdio: 'inherit' });
            console.info('================================================================');
            console.info('[REPORT] ✅ Allure Report generated successfully!');
            console.info('[REPORT] 📄 Single file report ready at: ./allure-report/index.html');
            console.info('================================================================\n');
        } catch (error) {
            console.error('[REPORT] ❌ Failed to generate Allure Report:', error);
        }
    }
};
