'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getPlayers = void 0;
const axios_1 = __importDefault(require('axios'));
const jsdom_1 = __importDefault(require('jsdom'));
const getPlayers = workflow =>
  __awaiter(void 0, void 0, void 0, function* () {
    const teams = [
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/buf',
        name: 'Buffalo Bills',
        abr: 'buf',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/mia',
        name: 'Miami Dolphins',
        abr: 'mia',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/ne',
        name: 'New England Patriots',
        abr: 'ne',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/nyj',
        name: 'New York Jets',
        abr: 'nyj',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/bal',
        name: 'Baltimore Ravens',
        abr: 'bal',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/cin',
        name: 'Cincinnati Bengals',
        abr: 'cin',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/cle',
        name: 'Cleveland Browns',
        abr: 'cle',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/pit',
        name: 'Pittsburgh Steelers',
        abr: 'pit',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/hou',
        name: 'Houston Texans',
        abr: 'hou',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/ind',
        name: 'Indianapolis Colts',
        abr: 'ind',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/jax',
        name: 'Jacksonville Jaguars',
        abr: 'jax',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/ten',
        name: 'Tennessee Titans',
        abr: 'ten',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/den',
        name: 'Denver Broncos',
        abr: 'den',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/kc',
        name: 'Kansas City Chiefs',
        abr: 'kc',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/lv',
        name: 'Las Vegas Raiders',
        abr: 'lv',
        img: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI5OTk5OXB4IiBoZWlnaHQ9Ijk5OTk5cHgiIHZpZXdCb3g9IjAgMCA5OTk5OSA5OTk5OSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBzdHJva2U9Im5vbmUiIGZpbGw9Im5vbmUiIGZpbGwtb3BhY2l0eT0iMCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9Ijk5OTk5IiBoZWlnaHQ9Ijk5OTk5Ij48L3JlY3Q+IDwvZz4gPC9zdmc+',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/lac',
        name: 'Los Angeles Chargers',
        abr: 'lac',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/dal',
        name: 'Dallas Cowboys',
        abr: 'dal',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/nyg',
        name: 'New York Giants',
        abr: 'nyg',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/phi',
        name: 'Philadelphia Eagles',
        abr: 'phi',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/wsh',
        name: 'Washington Commanders',
        abr: 'wsh',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/chi',
        name: 'Chicago Bears',
        abr: 'chi',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/det',
        name: 'Detroit Lions',
        abr: 'det',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/gb',
        name: 'Green Bay Packers',
        abr: 'gb',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/min',
        name: 'Minnesota Vikings',
        abr: 'min',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/atl',
        name: 'Atlanta Falcons',
        abr: 'atl',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/car',
        name: 'Carolina Panthers',
        abr: 'car',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/no',
        name: 'New Orleans Saints',
        abr: 'no',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/tb',
        name: 'Tampa Bay Buccaneers',
        abr: 'tb',
        img: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI5OTk5OXB4IiBoZWlnaHQ9Ijk5OTk5cHgiIHZpZXdCb3g9IjAgMCA5OTk5OSA5OTk5OSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZyBzdHJva2U9Im5vbmUiIGZpbGw9Im5vbmUiIGZpbGwtb3BhY2l0eT0iMCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9Ijk5OTk5IiBoZWlnaHQ9Ijk5OTk5Ij48L3JlY3Q+IDwvZz4gPC9zdmc+',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/ari',
        name: 'Arizona Cardinals',
        abr: 'ari',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/lar',
        name: 'Los Angeles Rams',
        abr: 'lar',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/sf',
        name: 'San Francisco 49ers',
        abr: 'sf',
      },
      {
        url: 'https://www.espn.com/nfl/team/depth/_/name/sea',
        name: 'Seattle Seahawks',
        abr: 'sea',
      },
    ];
    const { JSDOM } = jsdom_1.default;
    const response = yield Promise.all(
      teams.map(t =>
        __awaiter(void 0, void 0, void 0, function* () {
          const url = t.url;
          const html = yield axios_1.default.get(url);
          const dom = new JSDOM(html.data);
          const title = dom.window.document.querySelector('body');
          const imageURls = [];
          dom.window.document
            .querySelectorAll('img')
            .forEach(img => imageURls.push(img.src));
          const teamDepthChart = [];
          const table = dom.window.document.querySelectorAll(
            '.nfl-depth-table .Table__TD span:not(.nfl-injuries-status)'
          );
          const ir = dom.window.document.querySelectorAll(
            '.nfl-depth-table .Table__TD span.nfl-injuries-status'
          );
          const positionsLists = dom.window.document.querySelectorAll(
            '.nfl-depth-table tbody span:not(.nfl-injuries-status)'
          );
          const tablesArray = dom.window.document.querySelectorAll(
            '.nfl-depth-table tbody'
          );
          const allData = [];
          if (tablesArray.length === 6) {
            const offPositions = tablesArray[0].querySelectorAll(
              'span:not(.nfl-injuries-status)'
            );
            const offPlayers = tablesArray[1].querySelectorAll('span');
            // const offPlayerStatuses = tablesArray[1].querySelectorAll(
            //   'span.nfl-injuries-status'
            // );
            const t3t4rows = tablesArray[2].querySelectorAll(
              'span:not(.nfl-injuries-status)'
            );
            const t5t6rows = tablesArray[4].querySelectorAll(
              'span:not(.nfl-injuries-status)'
            );
            offPlayers.forEach((p, index) => {
              const player = (
                p.querySelector('a') || p.querySelector(':text')
              ).textContent.trim();
              const status = p
                .querySelector('span.nfl-injuries-status')
                .textContent.trim();
              const idx = parseInt(p.parentElement.parentElement.dataset.idx);
              const pos = offPositions[idx].textContent.trim();
              allData.push({
                player,
                status,
                pos,
                posGroup: 'Offense',
              });
            });
          }
          let ts = [];
          const pl = [];
          const startOffPositions = 0;
          let endOffPosition = 0;
          let completerOffense = false;
          let endDefPosition = 0;
          let completeDEfense = false;
          table.forEach(t => {
            const idx = parseInt(t.parentElement.parentElement.dataset.idx);
            if (endOffPosition != 0 && idx == 0) {
              endOffPosition++;
              completerOffense = true;
            }
            if (!completerOffense) {
              endOffPosition = idx;
            } else if (!completeDEfense) {
              endDefPosition = endOffPosition + idx;
            }
            ts.push({ value: t.textContent });
          });
          let positionGroup = 'oPos';
          const OffPositions = [];
          positionsLists.forEach(p => {
            const idx = parseInt(p.parentElement.parentElement.dataset.idx);
            switch (positionGroup) {
              case 'oPos':
                break;
              default:
                break;
            }
            if (idx == 0) {
            }
            pl.push({ value: p.textContent, positionGroup, idx });
          });
          ir.forEach((i, index) => {
            ts[index]['status'] = i.textContent.trim();
          });
          ts = ts.filter(t => t != '');
          const offPositions = ts.slice(startOffPositions, endOffPosition);
          const offPlayers = ts.slice(endOffPosition, endOffPosition * 4);
          const defPositions = ts.slice(endOffPosition, endDefPosition);
          const defPlayers = ts.slice(endDefPosition, endDefPosition * 4);
          let count = 0;
          let positionIndex = 0;
          offPlayers.map(op => {
            if (positionIndex < 11) {
              op['position'] = offPositions[positionIndex]['value'];
              count++;
              if (count === 4) {
                count = 1;
                positionIndex++;
              }
            }
          });
          return {
            ts,
            offPlayers,
            offPositions,
            defPlayers,
            pl,
            len: tablesArray.length,
            allData,
          };
        })
      )
    );
    return { response };
  });
exports.getPlayers = getPlayers;
//Each Team Has 144 Ros
//0-11 off positions
//12-59 off players
//60-70 def posiotions
//71 - 114def players
//115-120 sp postions
//121-144 sp players
//# sourceMappingURL=getPlayers.js.map
