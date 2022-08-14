"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getDepthCharts_1 = require("./requests/getDepthCharts");
const getPlayers_1 = require("./requests/getPlayers");
// const password = process.env.SECRET_KEY;
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    // res.setHeader('Access-Control-Allow-Credentials', 'false');
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// SEARCH REQUEST
app.get('/getDepthChart', (req, res) => {
    const workFlow = {
        getTeamsList: false,
        getPlayersData: false,
        updatingTeamsDB: false,
        updatingPlayersDB: false,
    };
    (0, getDepthCharts_1.getTeamsAndDepthCharts)(workFlow)
        .then(resp => {
        res.status(200).json({ resp });
    })
        .catch(err => {
        res.status(500).json({ err });
    });
});
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
app.get('/getPlayers', (req, res) => {
    const workFlow = {
        getTeamsList: false,
        getPlayersData: false,
        updatingTeamsDB: false,
        updatingPlayersDB: false,
    };
    (0, getPlayers_1.getPlayers)(workFlow)
        .then(resp => {
        res.status(200).json({ resp });
    })
        .catch(err => {
        res.status(500).json({ err });
    });
});
//# sourceMappingURL=index.js.map