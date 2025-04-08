"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqHandler = void 0;
const node_1 = require("@angular/ssr/node");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const serverDistFolder = path_1.default.resolve(); // ✅ Compatible con CommonJS
const browserDistFolder = path_1.default.resolve(serverDistFolder, '../browser');
const app = (0, express_1.default)();
const angularApp = new node_1.AngularNodeAppEngine();
/**
 * Serve static files from /browser
 */
app.use(express_1.default.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
}));
/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
    angularApp
        .handle(req)
        .then((response) => response ? (0, node_1.writeResponseToNodeResponse)(response, res) : next())
        .catch(next);
});
/**
 * Start the server if this module is the main entry point.
 */
if (require.main === module) {
    const port = process.env['PORT'] || 4000;
    app.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}
/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
exports.reqHandler = (0, node_1.createNodeRequestHandler)(app);
