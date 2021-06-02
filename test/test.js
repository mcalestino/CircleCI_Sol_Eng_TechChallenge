const Browser = require('zombie');
const { assert } = require('chai');

describe('Button Clicks', () => {
    const browser = new Browser();

    before(() => {
        app = require('../app.js');
    });

    beforeEach(async () => {
        return await browser.visit(`http://localhost:${app.port}`);
    });

    after(async () => {
        browser.destroy();
        await app.server.close();
    });

    describe('Hide Text', () => {
        it('should hide text on page load', () => {
            assert.isTrue(browser.document.querySelector('#hidden-text').hidden);
        });

        it('should hide text after two clicks', () => {
            const button = browser.document.querySelector('#button-to-click');
            for (i = 0; i < 2; i++) button.click();
            assert.isTrue(browser.document.querySelector('#hidden-text').hidden);
        });

        it('should hide text after 100 clicks', () => {
            const button = browser.document.querySelector('#button-to-click');
            for (i = 0; i < 100; i++) button.click();
            assert.isTrue(browser.document.querySelector('#hidden-text').hidden);
        });
    });

    describe('Show Text', () => {
        it('should show text after one click', () => {
            const button = browser.document.querySelector('#button-to-click');
            button.click();
            assert.isFalse(browser.document.querySelector('#hidden-text').hidden);
        });

        it('should show text after three clicks', () => {
            const button = browser.document.querySelector('#button-to-click');
            for (i = 0; i < 3; i++) button.click();
            assert.isFalse(browser.document.querySelector('#hidden-text').hidden);
        });

        it('should show text after 101 clicks', () => {
            const button = browser.document.querySelector('#button-to-click');
            for (i = 0; i < 101; i++) button.click();
            assert.isFalse(browser.document.querySelector('#hidden-text').hidden);
        });
    });
});