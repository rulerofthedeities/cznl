import { CznlPage } from './app.po';

describe('cznl App', () => {
  let page: CznlPage;

  beforeEach(() => {
    page = new CznlPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
