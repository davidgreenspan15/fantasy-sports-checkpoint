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
exports.getToken = void 0;
const axios_1 = __importDefault(require("axios"));
const getToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    var accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
    const authHeader = Buffer.from('dj0yJmk9Wm1mR2FkQmFXalo1JmQ9WVdrOWFYZFJhMDB5TTBrbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWJl' +
        ':' +
        '9aaa50e61add7e133c8802ef411e27fa16cceb30').toString('base64');
    console.debug(authHeader);
    const headers = {
        Authorization: `Basic ${authHeader}`,
        // 'Content-Type': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const requestBody = {
        redirect_uri: 'https://localhost:8080/',
        code: code,
        grant_type: 'authorization_code',
    };
    let data = Object.keys(requestBody)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(requestBody[key]))
        .join('&');
    try {
        const promise = yield (0, axios_1.default)({
            headers,
            withCredentials: true,
            method: 'post',
            data: data,
            url: accessTokenUrl,
        });
        return promise;
    }
    catch (err) {
        console.log(err, 'failed here');
    }
});
exports.getToken = getToken;
//# sourceMappingURL=get_token.js.map