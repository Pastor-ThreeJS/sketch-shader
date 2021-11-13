const path = require('path');
const rimraf = require('rimraf');
const fs = require("fs");

var main = (name, finish) => {
    //rimraf.sync(path.resolve(__dirname, '../' + name), {}, function (err) { console.error(err) });
    let mypath = path.resolve(__dirname, '../' + name);
    console.log(mypath)
    fs.exists(mypath, (exists) => {
        if (exists) {
            fs.rmdir(mypath, { recursive: true, force: true }, () => {
                finish();
            });
        }
        else {
            finish();
        }
    });
}

module.exports = main;
