

var config = {
    srcFolder: __dirname + "/../",
    destFolder: __dirname + "/../release",
    group: {
        "cQueryPackage": ["modA.js", "modB.js"]
    },
    combine: {
        template: {
            options: {},
            files: {
                "mini/book.js": ["@group:cQueryPackage", "require.js"]
            }
        },
        js: {
            options: {},
            files: {
                "mini/test.js": ["@group:cQueryPackage", "require.js"]
            }
        }
    }

}

var builder = require("./res-builder.js");
builder.combine(config);