"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const EasyLogicStudio_1 = require("./EasyLogicStudio");
function activate(context) {
    context.subscriptions.push(EasyLogicStudio_1.EasyLogicStudioProvider.register(context));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map