import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { expect } from 'chai';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo().then(() => 
      page.getTitleText().then((text) => 
        expect(text).to.be.equal('Welcome to app1!')));
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.to.contain({
      level: logging.Level.SEVERE,
    } as logging.Entry);
  });
});
