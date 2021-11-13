const fs = require("fs");
const ftpClient = require('ftp');
const path = require('path');
const compressing = require('compressing');
const options = require("./setting");

var main = (finish) => {
    CheckDir(() => {
        Package(() => {
            console.log("文件打包完成");
            //此处需等待一定时间
            UploadFileToFTP(() => {
                console.log("文件上传完成")
                finish();
            });
        });
    }, () => {
        console.log("打包文件夹不存在");
        finish();
    })
}

module.exports = main;

//检查目录
function CheckDir(resolve, err) {
    fs.exists(path.join(__dirname, "../" + options.output + "/" + options.assets + "/"), function (exists) {
        if (!exists) {
            err()
        }
        else {
            resolve()
        }
    });
}

//打包
function Package(finish) {

    //检查目录
    let checkDir = (resolve) => {
        fs.exists(path.join(__dirname, "../" + options.cache + "/"), function (exists) {
            if (!exists) {
                fs.mkdir(path.join(__dirname, "../" + options.cache), (err) => {
                    if (err) throw err;
                    resolve()
                })
            }
            else {
                resolve()
            }
        });
    }

    //开始打包
    checkDir(() => {
        compressing.zip.compressDir(path.join(__dirname, "../" + options.output + "/" + options.assets + "/"), path.join(__dirname, "../" + options.cache + "/" + options.filename))
            .then(() => {
                finish();
            })
            .catch(err => {
                console.error(err);
            });
    });
}

//上传
async function UploadFileToFTP(finish) {
    if (fs.existsSync(path.join(__dirname, "../" + options.cache + "/"))) {
        fs.readdir(path.join(__dirname, "../" + options.cache + "/"), function (err, files) {
            if (err) {
                console.log(err);
                return;
            }

            let count = files.length;
            let finishnumber = 0;
            console.log("需上传文件数:" + count);
            let results = {};
            files.forEach(function (firstName) {
                fs.readFile(firstName, function (data) {
                    results[firstName] = data;
                    // 对所有文件进行处理
                    let ftp = new ftpClient();
                    let filePath = `${options.assets + "/" + options.remote.path}`;
                    console.log(filePath)
                    ftp.connect(options);
                    ftp.on('ready', async function () {

                        for (let i = 0; i < files.length; i++) {

                            new Promise(function (resolve, reject) {
                                //判断文件夹是否存在，不存在就创建文件夹
                                ftp.get(filePath, function (err) {
                                    if (err) {
                                        ftp.mkdir(filePath, false, function () {
                                            ftp.put(`${path.join(__dirname, "../" + options.cache + "/")}` + "/" + `${options.filename}`, filePath + "/" + `${options.filename}`, function (err) {
                                                if (err) {
                                                    reject(err);
                                                }
                                                else {
                                                    finishnumber++;
                                                    console.log("已上传文件数:" + count);
                                                    resolve(true);

                                                    if (finishnumber == count) {
                                                        ftp.destroy();
                                                        finish();
                                                    }
                                                }
                                            });
                                        });
                                    }
                                })
                            })
                        }
                    }).on('error', async function (e) {
                        console.log(e);
                    }
                    );
                });
            });
        });
    }
    else {
        console.log(path.join(__dirname, "../" + options.cache + "/") + "  Not Found!");
    }
}




