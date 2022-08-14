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
exports.getTeamsAndDepthCharts = void 0;
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = __importDefault(require("jsdom"));
const getTeamsAndDepthCharts = (workflow) => __awaiter(void 0, void 0, void 0, function* () {
    const { JSDOM } = jsdom_1.default;
    const url = 'https://www.espn.com/nfl/story/_/id/29098001/2020-nfl-depth-charts-all-32-teams';
    const html = yield axios_1.default.get(url);
    const dom = new JSDOM(html.data);
    const imageURls = [];
    dom.window.document
        .querySelectorAll('img')
        .forEach((img) => imageURls.push(img.src));
    const teamDepthChart = [];
    dom.window.document
        .querySelectorAll('.article-body h2 a')
        .forEach((a) => {
        if (a.href.includes('https://www.espn.com/nfl/team/depth/_/name/')) {
            const abr = a.href.replace('https://www.espn.com/nfl/team/depth/_/name/', '');
            teamDepthChart.push({
                url: a.href,
                name: a.textContent,
                abr,
            });
        }
    });
    if (teamDepthChart.length === 32) {
        workflow.getTeamsList = true;
    }
    return { imageURls, teamDepthChart, workflow };
});
exports.getTeamsAndDepthCharts = getTeamsAndDepthCharts;
//# sourceMappingURL=getDepthCharts.js.map