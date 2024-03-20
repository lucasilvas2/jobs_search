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
      "clipboard-write",
      "background-sync",
      "clipboard-sanitized-write",
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

    const botoesDropdown = await this.page.$$(
      ".entity-result__actions-overflow-menu-dropdown > .artdeco-dropdown > button"
    );

    for (let botao of botoesDropdown) {
      await botao.click();
      await this.page.waitForSelector('.artdeco-dropdown__content--is-open' , {  visible: true , timeout: 0 });

      const botaoCopiarLinkId = await this.page.evaluate(() => {
        const botoes = Array.from(
          document.querySelectorAll('.artdeco-dropdown__item[role="button"]')
        );
        const botaoCopiarLink = botoes.find((botao) =>
          botao.textContent.includes("Copiar link")
        );
        return botaoCopiarLink ? botaoCopiarLink.getAttribute("id") : null;
      });

      console.log(botaoCopiarLinkId)
      if (botaoCopiarLinkId) {
        await this.page.waitForSelector(`#${botaoCopiarLinkId}`, {
          visible: true,
        });
        await this.page.click(`#${botaoCopiarLinkId}`);
      }

      await this.page.waitForSelector(".artdeco-toast-item, .artdeco-toast-item--visible, .ember-view",{ timeout: 0 });
      await this.page.click(".artdeco-toast-item__dismiss");

      const linkCopiado = await this.page.evaluate(async () => {
        const text = await navigator.clipboard.readText();
        return text;
      });

      linksCopiados.push(linkCopiado);
    }

    return linksCopiados;
  }
}

module.exports = PuppeteerService;
