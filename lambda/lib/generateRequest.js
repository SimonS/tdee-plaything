"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var generateRequest = function (_a) {
    var authToken = _a.access_token, endpoint = _a.bdt_endpoint, body = __rest(_a, ["access_token", "bdt_endpoint"]);
    return ({
        authToken: authToken,
        endpoint: "https://breakfastdinnertea.co.uk" + endpoint,
        body: JSON.stringify(body),
    });
};
exports.default = generateRequest;
//# sourceMappingURL=generateRequest.js.map