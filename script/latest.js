const util = require('util');
const path = require('path');
const child_process = require('child_process');

const exec = util.promisify(child_process.exec);
const command = async function (name, finish) {
    let command = "npm install " + name + "@latest -save";
    console.log(command);
    await exec(command);;
}

var main = (name, finish) => {
    command(name).finally(() => {
        finish();
    });
}

module.exports = main;