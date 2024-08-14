"use strict";
exports.__esModule = true;
exports.GetCurrentUser = void 0;
var common_1 = require("@nestjs/common");
exports.GetCurrentUser = common_1.createParamDecorator(function (data, context) {
    var user = context.switchToHttp().getRequest().user;
    if (data) {
        return user[data];
    }
    return user;
});
