"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSiteData = void 0;
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = __importDefault(require("jsdom"));
const getSiteData = () => __awaiter(void 0, void 0, void 0, function* () {
    const { JSDOM } = jsdom_1.default;
    const html = yield axios_1.default.get('https://www.example.com');
    const dom = new JSDOM(html.data);
    const title = dom.window.document.querySelector('h1');
    if (title) {
        console.log(title.textContent);
    }
});
exports.getSiteData = getSiteData;
//# sourceMappingURL=index.js.map