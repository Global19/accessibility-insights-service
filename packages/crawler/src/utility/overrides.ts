// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// tslint:disable: no-any no-unsafe-any no-require-imports no-var-requires no-function-expression
function overrideCheckPrototypeUtilsFunc(exports: any): any {
    const originalFunc = exports.checkParamPrototypeOrThrow;
    exports.checkParamPrototypeOrThrow = function (...args: any): any {
        if (args[3] === 'Apify.RequestQueue') {
            return true;
        } else {
            return originalFunc(...args);
        }
    };

    return exports;
}

function overrideExports(moduleName: string, exports: any): any {
    if (moduleName === 'apify-shared/utilities') {
        return overrideCheckPrototypeUtilsFunc(exports);
    }

    return exports;
}

const moduleRef = require('module');
moduleRef.prototype.require = new Proxy(moduleRef.prototype.require, {
    apply(target: any, thisArg: any, argumentsList: any): any {
        const moduleName = argumentsList[0];
        const exports = Reflect.apply(target, thisArg, argumentsList);

        return overrideExports(moduleName, exports);
    },
});