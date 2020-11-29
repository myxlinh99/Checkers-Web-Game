const assert = require('assert').strict;
const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('https://checkers-ateam.azurewebsites.net/');


driver.sleep(2000).then(function() {
    driver.findElement(By.className('navbar-brand')).click().then(() => 
    {
        driver.findElements(By.className('list-group-item list-group-item-action'))
        .then((elements) => assert.ok(elements.length == 3)) ;
    
    });
    
    

});

driver.sleep(5000).then(function() {
    driver.quit();
  });