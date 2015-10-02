module.exports = (function () {

    var fs = require("fs"),
        path = require("path"),
        uglify = require("uglify-js"),
        config = null;

    function combine(cfg) {
        if (!cfg) {
            return;
        }
        config = cfg;
        var maps = getCombineMaps(config);

        maps.forEach(function (map) {
            _mkdirsSync(path.dirname(map.output));
            var content = uglify.minify(map.files).code;
            fs.writeFileSync(map.output, content);
        });
    }

    function getCombineMaps(config) {
        if (!config || !config.combine) {
            return null;
        }

        var maps = [];
        for (var key in config.combine) {
            if (config.combine.hasOwnProperty(key)) {
                var item = config.combine[key];
                var files = item.files;
                for (var fk in files) {
                    if (files.hasOwnProperty(fk)) {
                        if (fk && files[fk] && files[fk].length > 0) {
                            var map = {
                                options: item.options,
                                output: path.normalize(config.destFolder + "/" + fk),
                                files: []
                            };
                            files[fk].forEach(function (f) {
                                map.files = map.files.concat(getRealFiles(f));
                            });
                            maps.push(map);
                        }
                    }
                }
            }
        }

        return maps;
    }

    function getRealFiles(fileName) {
        var files = [], groupKey = "@group:";
        var pos = fileName.indexOf(groupKey);
        if (pos === 0) {
            var groupName = fileName.substr(groupKey.length, fileName.length - groupKey.length);
            if (config.group && config.group[groupName]) {
                var groupFiles = config.group[groupName];
                groupFiles.forEach(function (gf) {
                    files = files.concat(getRealFiles(gf));
                });
            }
        } else {
            files.push(path.normalize(config.srcFolder + "/" + fileName));
        }
        return files;
    }

    function getFiles(dir) {
        var fileNames = [];
        var files = fs.readdirSync(dir);
        files.forEach(function (item) {
            var path = dir + "\\" + item;
            var stats = fs.statSync(path);
            if (stats.isDirectory()) {
                fileNames = fileNames.concat(getFiles(path));
            } else {
                fileNames.push(path);
            }
        });
        return fileNames;
    }

    function _mkdirsSync(dirName, mod) {
        if (!fs.existsSync(dirName)) {
            _mkdirsSync(path.dirname(dirName));
            fs.mkdirSync(dirName, mod);
        }
    }


    return {
        combine: combine
    };
})();






