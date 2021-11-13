const path = require('path');
const fs = require("fs");
const xml2js = require('xml2js');
var sd = require('silly-datetime');

var settingPath = path.join(__dirname, '../' + "build" + "/setting/setting.xml");
var main = (finish) => {
    fs.exists(settingPath, function (exists) {
        if (!exists) {
            console.log("not find setting.xml=>path:" + settingPath);
            if (finish)
                finish();
        }
        else {
            var parser = new xml2js.Parser();
            var filePath = settingPath;
            fs.readFile(filePath, function (err, data) {
                parser.parseString(data, function (err, result) {

                    //修改编译时间
                    let newDate = new Date(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'));
                    (result.root.Setting)[0].$.compiletime = newDate

                    //保存文件
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject(result);
                    fs.writeFile(settingPath, xml, (err) => {
                        if (err) {
                            throw err;
                        }
                        if (finish)
                            finish();
                    });
                });
            });
        }
    });
}

module.exports = main;