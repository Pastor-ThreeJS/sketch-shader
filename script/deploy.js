const path = require('path');
const options = require("./setting");
let fs = require("fs");
let ftpClient = require('ftp');
let localDirectory = path.join(__dirname, "../build")

var readamount = 0;
var fileGroup = [];
var dirGroup = [];
var results = {};
var createamount = 0;
var readDir = function (pathName, finish) {
    var tempdirGroup = [];
    var files = fs.readdirSync(pathName);
    readamount += files.length;
    (function iterator(i) {
        if (i == files.length) {
            // console.log(readamount);
            // console.log(fileGroup.length);
            // console.log(dirGroup.length);
            if (tempdirGroup.length > 0) {
                tempdirGroup.forEach((dir) => {
                    readDir(pathName + "/" + dir, finish)
                })
            }

            if ((dirGroup.length + fileGroup.length) >= readamount)
                finish();
            return;
        }
        fs.stat(path.join(pathName, files[i]), function (err, data) {
            if (data.isFile()) {
                let name = files[i];
                results[pathName + "/" + name] = {
                    isdir: false,
                    path: pathName + "/" + name,
                    relativePath: (pathName + "/" + name).replace(localDirectory, ""),
                }
                fileGroup.push(files[i]);
            }
            else {
                let name = files[i];
                results[pathName + "/" + name] = {
                    isdir: true,
                    path: pathName + "/" + name,
                    relativePath: (pathName + "/" + name).replace(localDirectory, ""),
                }
                dirGroup.push(files[i]);
                tempdirGroup.push(files[i]);
            }
            iterator(i + 1);
        });
    })(0);

}

async function main(finish) {

    //整理当前文件夹下的所有资源
    readDir(localDirectory, () => {
        // console.log(dirGroup.length);
        // console.log(fileGroup.length);
        // console.log(results)

        //资源分类
        dirGroup = [];
        fileGroup = [];
        Object.values(results).forEach((item) => {
            let filePath = ``;
            //判断文件夹是否存在，不存在就创建文件夹
            if (item.isdir) {
                dirGroup.push(filePath + item.relativePath);
            }
            else {
                fileGroup.push(filePath + item.relativePath);
            }
        });
        // console.log(dirGroup);
        // console.log(fileGroup);

        let ftp = new ftpClient();
        ftp.connect(options);
        ftp.on('ready', async function () {
            //解析

            //创建远端文件
            let postFile = () => {
                createamount = 0;
                console.log("远端子文件夹创建完毕");

                fileGroup.forEach((relativePath) => {
                    let promise = new Promise(function (resolve, reject) {
                        let local = `${path.join(__dirname, "../" + options.local)}` + `${relativePath}`;
                        let remote = `${options.remote.build}` + `${relativePath}`;
                        ftp.put(fs.createReadStream(local),
                            remote,
                            (err) => {
                                if (err) {
                                    // console.log("本地文件" + local);
                                    // console.log("远端文件" + remote);
                                    // console.log(err);
                                }
                                createamount++;
                                // console.log(createamount)
                                // console.log(fileGroup.length)
                                if (createamount == fileGroup.length) {
                                    ftp.destroy()
                                    finish();
                                }
                            });
                    });
                });
                if (fileGroup.length == 0) {
                    ftp.destroy()
                    finish();
                }
            }

            //创建远端文件夹
            let postDir = () => {
                dirGroup.forEach((relativePath) => {
                    ftp.get(relativePath, function (err) {
                        if (err) {
                            ftp.mkdir(`${options.remote.build + relativePath}`, false, function () {
                                createamount++;
                                if (createamount == dirGroup.length) {
                                    postFile();
                                }
                            })
                        }
                    })
                });
                if (dirGroup.length == 0)
                    postFile();
            }

            let mkdir = () => {
                ftp.mkdir(`${options.remote.build}`, false, function () {
                    console.log("创建远端文件夹 " + options.remote.build);
                    setTimeout(() => {
                        postDir();
                    }, 1000);
                })
            }

            ftp.mkdir(options.remote.build, function (err) {
                if (err) {
                    // 文件夹存在
                    // console.log(options.remote.build)
                    // console.log(err)
                    console.log("远端已创建文件夹 " + options.remote.build)
                }
                ftp.rmdir(options.remote.build, true, function (err) {
                    console.log("清空远端文件夹 " + options.remote.build)
                    setTimeout(() => {
                        mkdir();
                    }, 100)
                }
                );

            })
        });
    });
}


module.exports = main;

