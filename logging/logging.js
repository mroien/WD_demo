/**
 * Created by mroien on 10/26/15.
 */

"use strict";

require('colors');

exports.configure = function (driver) {
    // See whats going on
    driver.on('status', function (info) {
        console.log(info.cyan);
    });
    driver.on('command', function (meth, path, data) {
        console.log(' > ' + meth.yellow, path.grey, data || '');
    });
    driver.on('http', function (meth, path, data) {
        console.log(' > ' + meth.magenta, path, (data || '').grey);
    });
};
