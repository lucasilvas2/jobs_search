const PuppeteerService = require("./services/puppeterService.js");

const config =  {
    BASE_URL_LINKEDIN,
    EMAIL_LINKEDIN,
    PASSWORD_LINKEDIN,
    STRING_SEARCH_LINKEDIN,
} = require("./config.js");

const service = new PuppeteerService(config);
(async () => {
    await service.init();
    await service.login();
    const resultList = await service.initSearch();
    console.log(resultList);
})();


