const {displayNumber} = require("./utils/displayNumber");
const {convertData} = require("./utils/convertData");
const {Builder, until, By} = require("selenium-webdriver");

async function generateReport() {

    // get from file source json
    /** @type {Array<{name: string, address: string}>} */
    const items = require('./source.json')

    /** @type {Array<{name: string, address: string, result: string, value: number}>} */
    const results = [];
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let result = await ingestFromSelenium(item.address)
        const input = {
            name: item.name, address: item.address, result: result, value: convertData(result)
        }
        results.push(input)
    }


    const sortedResults = results.sort((a, b) => {
        return b.value - a.value
    })
    const total = sortedResults.reduce((acc, item) => {
        return acc + item.value
    }, 0)
    const totalFormattted = displayNumber(total)

    for (let i = 0; i < sortedResults.length; i++) {
        let item = sortedResults[i];
        console.log(item.name, ":", displayNumber(item.value))
    }
    console.log("total: ", totalFormattted)

}

async function ingestFromSelenium(address) {
    let driver;
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://debank.com/profile/' + address);

    // wait until object visible
    await driver.wait(until.elementLocated(By.className('HeaderInfo_totalAssetInner__HyrdC HeaderInfo_curveEnable__HVRYq')), 5000);
    await driver.sleep(3000);

    const taskInput = await driver.findElement(By.className('HeaderInfo_totalAssetInner__HyrdC HeaderInfo_curveEnable__HVRYq'));
    // get innerText
    const innerText = await taskInput.getText();
    await driver.quit();
    return innerText
}


generateReport()
