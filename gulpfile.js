var gulp = require('gulp');
var bump = require('gulp-bump');
const options = require("./script/setting");
const build = require("./script/build");
const clean = require("./script/clean");
const download = require("./script/download");
const upload = require("./script/upload");
const latest = require("./script/latest");
const deploy = require("./script/deploy");

gulp.task('build', gulp.series((done) => {
    build(() => {
        console.log('build is done');
        done();
    });
}));

gulp.task('latest', gulp.series((done) => {
    latest("zsqy-iot-utility", () => {
        latest("iot-env-manager", () => {
            console.log('latest is done');
            done();
        });
    });
}));

gulp.task('clean', gulp.series((done) => {
    clean(options.dist, () => {
        clean(options.cache, () => {
            console.log('clean is done');
            done();
        });
    });
}));

gulp.task('upload', gulp.series((done) => {
    upload(() => {

        clean(options.cache, () => {
            console.log('upload is done');
            done();
        });
    });
}));

gulp.task('download', gulp.series((done) => {
    clean(options.output + "/" + options.assets, () => {
        download(() => {
            console.log('download is done');
            done();
        });
    });

}));

gulp.task('upgrade_version', gulp.series((done) => {
    gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
    console.log('upgrade is done');
    done();
}));

gulp.task('deploy', gulp.series((done) => {
    deploy(() => {
        console.log('deploy is done');
        done();
    });
}));
