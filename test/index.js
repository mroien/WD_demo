/**
 * Created by mroien on 10/26/15.
 */

var wd = require('wd'),
    chai = require('chai'),
    assert = require('assert'),
    chaiAsPromised = require('chai-as-promised');


chai.use(chaiAsPromised);
chai.should();

// enables chai assertion chaining

chaiAsPromised.transferPromiseness = wd.transferPromiseness;

var driver = wd.promiseChainRemote(),
    asserters = wd.asserters,
    explicit_wait = require('../settings').explicit_wait,
    settings = require('../settings'),
    minutes = require('../utils/bits').minutes,
    seconds = require('../utils/bits').seconds;

require('../logging/logging').configure(driver);

var homePage = "http://www.tie3.ajc.com";

describe('WD.js ad verification', function() {
    this.timeout(0);
    this.slow(minutes(5));

    before(function() {
        //this.timeout(10000);
        return driver.init({
            browserName: 'chrome'
        });
    });

    after(function() {
        console.log('Quitting driver');
        return driver.quit();
    });

    it('home page loads', function() {
        return driver.get(homePage)
            .title().should.eventually.become("AJC.com: Atlanta News, Sports, Atlanta Weather, Business News | www.tie3.ajc.com");
    });
    it("RP02 ad is '300x100'", function() {

        var testPass = false;
        return driver
            .elementById('google_ads_iframe_11347122/www.ajc.com-wired/online/home_8')
            .getSize().then(function(dimension){
                var height = dimension.height;
                var width = dimension.width;

                if (height == 100 && width == 300) {
                    testPass = true;
                }
                assert.equal(testPass, true, "RP02 ad has a height of " + height + " and a width of " + width);
            })
    });

    it("RP03 ad should have a valid width and height dimension of - '300x250', '160x600', '302x250'", function() {

        var testPass = false;
        return driver.elementById('google_ads_iframe_11347122/www.ajc.com-wired/online/home_10')
            .getSize().then(function(dimension) {
                var height = dimension.height;
                var width = dimension.width;

                if (height == 250 && width == 300) {
                    testPass = true;
                } else if (height == 600 && width == 160) {
                    testPass = true;
                } else if (height == 250 && width == 302) {
                    testPass = true;
                }
                assert.equal(testPass, true, "RP03 ad has a height of " + height + " and a width of " + width);
            })
    });

    it("HP ad has valid width and height dimension of - '970x90', '950x30', '728x90'", function() {
        var testPass = false;
        return driver.elementById('google_ads_iframe_11347122/www.ajc.com-wired/online/home_1')
            .getSize().then(function(dimension) {
                var height = dimension.height;
                var width = dimension.width;

                if (height == 90 && width == 970) {
                    testPass = true;
                } else if (height == 30 && width == 950) {
                    testPass = true;
                } else if (height == 90 && width == 728) {
                    testPass = true;
                }
                assert.equal(testPass, true, "HP ad has a height of " + height + " and a width of " + width);
            });
    });
    it("SWB as has a valid width and height of '300x250", function() {
        var testPass = false;

        return driver.elementById('google_ads_iframe_11347122/www.ajc.com-wired/online/home_18')
            .getSize().then(function(dimension) {
                var height = dimension.height;
                var width = dimension.width;

                if (height == 250 && width == 300) {
                    testPass = true;
                }
                assert.equal(testPass, true, "The size test for SWB failed");
            })
    });
    it('SWB appears only in odd rows', function() {

        return driver.elementByClassName('jscroll-inner').then(function() {
            return driver.waitForElementsByClassName('cm-storycard-ad').then(function(temp) {
                    return temp.length
                })
                .should.eventually.equal(1, "There is more than 1 ad in the group");
        })
    });
    






    it('verify SWL is sized correctly every 3 rows', function() {

        return driver.window.scrollBy(0,4000);

    });





    it('verify that Rotator has 4 slots', function() {
        return driver
            .elementsByClassName("cm-media-rotator-nav").then(function(els) {
                return els.length
            })
            .should.eventually.equal(4);
    });

    it('verify that Rotator rotates (<60 seconds)', function() {
        function fetchActive() {
            return driver.complexFind(".cm-slide-active_0, .cm-slide-active_1, .cm-slide-active_2, .cm-slide-active_3, .cm-slide-active_4").then(function(el) {
                return el;
            });
        }
        var e1 = fetchActive();
        var e2 = setTimeout(fetchActive(), 20000);
        e1.should.not.equal(e2);
    });

    it('verify Rotator has ad slot NPR03 in 4th slot', function() {
     
        return driver
            .elementById("cm-ad-block-npr04")
            .text().then(function(txt) {
                return txt.split("\n")[0];
            })
            .should.eventually.equal("SPONSORED");
    });

});

	



