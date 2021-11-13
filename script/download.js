const ftpClient = require('ftp');
const fs = require("fs");
const path = require('path');
const compressing = require('compressing');
const options = require("./setting");

var main = (downloadfinish) => {
    CheckDir(() => {
        DownloadFileFromFTP(() => {
            console.log("下载完成");
            let mypath = path.join(__dirname, "../" + options.output + "/" + options.assets);
            fs.exists(mypath, function (exists) {
                if (!exists) {
                    fs.mkdir(mypath, (err) => {
                        if (err) throw err;
                        //等待文件夹创建
                        setTimeout(() => {
                            Uncompress(() => {
                                console.log("解压完成")
                                downloadfinish();
                            })
                        }, 100)
                    })
                }
                else {
                    Uncompress(() => {
                        console.log("解压完成")
                        downloadfinish();
                    })
                }
            });
        })
    })
}

module.exports = main;

//检查目录
function CheckDir(resolve) {
    fs.exists(path.join(__dirname, "../" + options.cache + "/"), function (exists) {
        if (!exists) {
            fs.mkdir(path.join(__dirname, "../" + options.cache + "/"), (err) => {
                if (err) throw err;
                resolve()
            })
        }
        else {
            resolve()
        }
    });
}

//下载
async function DownloadFileFromFTP(finish) {
    let ftp = new ftpClient();
    let path = `${options.assets + "/" + options.remote.path}` + "/" + `${options.filename}`;

    console.log(path);
    ftp.connect(options);
    ftp.on('ready', async function () {

        ftp.get(path, function (err, stream) {
            if (err) throwerr;
            stream.once('close', function () { ftp.end(); finish(); });
            stream.pipe(fs.createWriteStream(options.cache + "/" + options.filename));
        });

    }).on('error', async function (e) {
        console.log(e);
    })
}

//解压
async function Uncompress(finish) {
    let source = path.join(__dirname, "../" + options.cache + "/" + options.filename);
    let dest = path.join(__dirname, "../" + options.output + "/");
    console.log("解压源头：" + source);
    console.log("解压目标：" + dest);
    compressing.zip.uncompress(source, dest).finally(() => {
        finish();
    })
}

//删除
function rmdir(finish) {
    let rmdirPromise = (filePath) => {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, function (err, stat) {
                if (err) reject(err)
                if (stat.isFile()) {
                    fs.unlink(filePath, function (err) {
                        if (err) reject(err)
                        resolve()
                    })
                } else {
                    fs.readdir(filePath, function (err, dirs) {
                        if (err) reject(err)
                        dirs = dirs.map(dir => path.join(filePath, dir))
                        let index = 0;
                        (function next() {
                            if (index === dirs.length) {

                                // 此处递归删除掉所有子文件 后删除当前 文件夹
                                if (true) {
                                    fs.rmdir(filePath, function (err) {
                                        if (err) reject(err)
                                        resolve()
                                    })
                                }
                                else {
                                    resolve();
                                }
                            } else {
                                rmdirPromise(dirs[index++]).then(() => {
                                    next()
                                }, err => {
                                    reject(err)
                                })
                            }
                        })()
                    })
                }
            })
        })
    }

    fs.exists(path.join(__dirname, "../" + options.cache + "/"), function (exists) {
        if (!exists) {
            finish();
        }
        else {
            rmdirPromise(options.cache).then(() => {
                finish();
            })
        }
    });
}


