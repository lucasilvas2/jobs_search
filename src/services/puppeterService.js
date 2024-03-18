const puppeteer = require("puppeteer");

class PuppeteerService {
  constructor({
    BASE_URL_LINKEDIN,
    EMAIL_LINKEDIN,
    PASSWORD_LINKEDIN,
    STRING_SEARCH_LINKEDIN,
  }) {
    this.BASE_URL_LINKEDIN = BASE_URL_LINKEDIN;
    this.EMAIL_LINKEDIN = EMAIL_LINKEDIN;
    this.PASSWORD_LINKEDIN = PASSWORD_LINKEDIN;
    this.STRING_SEARCH_LINKEDIN = STRING_SEARCH_LINKEDIN;
    this.browser = null;
    this.page = null;
  }

  async init() {
    this.browser = await puppeteer.launch({ headless: false });
    const context = this.browser.defaultBrowserContext();
    await context.overridePermissions(this.BASE_URL_LINKEDIN, [
      "clipboard-read",
      'clipboard-write'
    ]);
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    console.log("Puppeter start...");
  }

  async login() {
    console.log("Login...");
    await this.page.goto(this.BASE_URL_LINKEDIN);

    await this.page.waitForSelector("#session_key");
    await this.page.waitForSelector("#session_password");

    await this.page.$eval(
      "#session_key",
      (el, email) => (el.value = email),
      this.EMAIL_LINKEDIN
    );
    await this.page.$eval(
      "#session_password",
      (el, password) => (el.value = password),
      this.PASSWORD_LINKEDIN
    );

    await this.page.click('button >>>> ::-p-text("Entrar")');
  }

  async initSearch() {
    await this.page.waitForSelector(".search-global-typeahead__input");
    await this.page.$eval(
      ".search-global-typeahead__input",
      (el, textSearch) => (el.value = textSearch),
      this.STRING_SEARCH_LINKEDIN
    );

    await this.page.focus(".search-global-typeahead__input");
    await this.page.keyboard.press("Enter");

    await this.page.waitForSelector(
      ".entity-result__actions-overflow-menu-dropdown"
    );

    let linksCopiados = [];

    const botoesDropdown = await this.page.$$(".entity-result__actions-overflow-menu-dropdown > .artdeco-dropdown > button");

    console.log(botoesDropdown)
    for (let botao of botoesDropdown) {

      await botao.click();

      // break;
      await this.page.evaluate(() => {
        const botaoCopiarLink = Array.from(
          document.querySelectorAll('.artdeco-dropdown__item[role="button"]')
        ).find((botao) => botao.textContent.includes("Copiar link"));
        if (botaoCopiarLink) botaoCopiarLink.click();
      });

      
      // await example();

      const linkCopiado = await this.page.evaluate(async () => {

        const text = await navigator.clipboard.readText();
        return text; 
      });


      linksCopiados.push(linkCopiado);
    }

    console.log(linksCopiados);
  }
}

module.exports = PuppeteerService;

