const fs = require('fs')
var json = JSON.parse(fs.readFileSync('package.json', 'utf8'))

var options = {
    host: "123.56.117.12",
    port: "21",
    user: "liutianshun",
    password: "123456",
    filename: "assets_" + json.version + ".zip",
    remote: { path: json.name, build: "build/" + json.name + "/" },
    cache: "cache",
    assets: "assets",
    output: "public",
    dist: "dist",
    local: "build",
};
module.exports = options;
