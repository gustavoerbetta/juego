// server.js — TEG Online (autoritativo)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// =====================================================================
//  DATOS
// =====================================================================
const CONTINENTS = {
    NA: { id: 'NA', name: 'América del Norte', bonus: 5, color: '#2c3e7a' },
    SA: { id: 'SA', name: 'América del Sur', bonus: 3, color: '#27ae60' },
    EU: { id: 'EU', name: 'Europa', bonus: 5, color: '#2980b9' },
    AF: { id: 'AF', name: 'África', bonus: 3, color: '#d4a017' },
    AS: { id: 'AS', name: 'Asia', bonus: 7, color: '#8e44ad' },
    OC: { id: 'OC', name: 'Oceanía', bonus: 2, color: '#16a085' }
};

const COUNTRIES = [
    { id: 'argentina', name: 'Argentina', cont: 'SA', x: 0.35, y: 0.77 },
    { id: 'brasil', name: 'Brasil', cont: 'SA', x: 0.39, y: 0.61 },
    { id: 'chile', name: 'Chile', cont: 'SA', x: 0.31, y: 0.77 },
    { id: 'colombia', name: 'Colombia', cont: 'SA', x: 0.32, y: 0.57 },
    { id: 'peru', name: 'Perú', cont: 'SA', x: 0.32, y: 0.635 },
    { id: 'uruguay', name: 'Uruguay', cont: 'SA', x: 0.39, y: 0.70 },
    { id: 'alaska', name: 'Alaska', cont: 'NA', x: 0.027, y: 0.40 },
    { id: 'canada', name: 'Canadá', cont: 'NA', x: 0.16, y: 0.24 },
    { id: 'california', name: 'California', cont: 'NA', x: 0.14, y: 0.51 },
    { id: 'mexico', name: 'México', cont: 'NA', x: 0.25, y: 0.54 },
    { id: 'nuevayork', name: 'Nueva York', cont: 'NA', x: 0.246, y: 0.42 },
    { id: 'oregon', name: 'Oregón', cont: 'NA', x: 0.09, y: 0.48 },
    { id: 'groenlandia', name: 'Groenlandia', cont: 'NA', x: 0.35, y: 0.21 },
    { id: 'terranova', name: 'Terranova', cont: 'NA', x: 0.276, y: 0.378 },
    { id: 'labrador', name: 'Labrador', cont: 'NA', x: 0.27, y: 0.30 },
    { id: 'yukon', name: 'Yukón', cont: 'NA', x: 0.09, y: 0.33 },
    { id: 'alemania', name: 'Alemania', cont: 'EU', x: 0.65, y: 0.465 },
    { id: 'espana', name: 'España', cont: 'EU', x: 0.52, y: 0.556 },
    { id: 'francia', name: 'Francia', cont: 'EU', x: 0.585, y: 0.49 },
    { id: 'granbretana', name: 'Gran Bretaña', cont: 'EU', x: 0.55, y: 0.395 },
    { id: 'islandia', name: 'Islandia', cont: 'EU', x: 0.43, y: 0.385 },
    { id: 'italia', name: 'Italia', cont: 'EU', x: 0.64, y: 0.55 },
    { id: 'polonia', name: 'Polonia', cont: 'EU', x: 0.697, y: 0.44 },
    { id: 'rusia', name: 'Rusia', cont: 'EU', x: 0.70, y: 0.325 },
    { id: 'suecia', name: 'Suecia', cont: 'EU', x: 0.605, y: 0.263 },
    { id: 'arabia', name: 'Arabia', cont: 'AS', x: 0.80, y: 0.605 },
    { id: 'aral', name: 'Aral', cont: 'AS', x: 0.73, y: 0.24 },
    { id: 'china', name: 'China', cont: 'AS', x: 0.90, y: 0.435 },
    { id: 'gobi', name: 'Gobi', cont: 'AS', x: 0.83, y: 0.436 },
    { id: 'india', name: 'India', cont: 'AS', x: 0.873, y: 0.51 },
    { id: 'iran', name: 'Irán', cont: 'AS', x: 0.767, y: 0.38 },
    { id: 'israel', name: 'Israel', cont: 'AS', x: 0.745, y: 0.585 },
    { id: 'japon', name: 'Japón', cont: 'AS', x: 0.925, y: 0.245 },
    { id: 'kamchatka', name: 'Kamchatka', cont: 'AS', x: 0.857, y: 0.203 },
    { id: 'malasia', name: 'Malasia', cont: 'AS', x: 0.945, y: 0.513 },
    { id: 'mongolia', name: 'Mongolia', cont: 'AS', x: 0.81, y: 0.322 },
    { id: 'siberia', name: 'Siberia', cont: 'AS', x: 0.825, y: 0.25 },
    { id: 'tartaria', name: 'Tartaria', cont: 'AS', x: 0.75, y: 0.20 },
    { id: 'taymir', name: 'Taymir', cont: 'AS', x: 0.80, y: 0.20 },
    { id: 'turquia', name: 'Turquía', cont: 'AS', x: 0.77, y: 0.47 },
    { id: 'egipto', name: 'Egipto', cont: 'AF', x: 0.73, y: 0.65 },
    { id: 'etiopia', name: 'Etiopía', cont: 'AF', x: 0.74, y: 0.74 },
    { id: 'madagascar', name: 'Madagascar', cont: 'AF', x: 0.78, y: 0.76 },
    { id: 'sahara', name: 'Sahara', cont: 'AF', x: 0.61, y: 0.675 },
    { id: 'sudafrica', name: 'Sudáfrica', cont: 'AF', x: 0.72, y: 0.825 },
    { id: 'zaire', name: 'Zaire', cont: 'AF', x: 0.66, y: 0.74 },
    { id: 'australia', name: 'Australia', cont: 'OC', x: 0.94, y: 0.71 },
    { id: 'borneo', name: 'Borneo', cont: 'OC', x: 0.898, y: 0.605 },
    { id: 'java', name: 'Java', cont: 'OC', x: 0.95, y: 0.628 },
    { id: 'sumatra', name: 'Sumatra', cont: 'OC', x: 0.85, y: 0.635 },
];

const ADJACENCIES = [
    ['alaska','yukon'],['alaska','kamchatka'],
    ['yukon','canada'],['yukon','oregon'],['canada','terranova'],['canada','oregon'],['nuevayork','california'],['nuevayork','groenlandia'],
    ['terranova','labrador'],['labrador','groenlandia'],
    ['terranova','nuevayork'],['oregon','california'],['oregon','nuevayork'],['oregon','alaska'],
    ['california','mexico'],['nuevayork','canada'],['mexico','colombia'],
    ['groenlandia','islandia'],['colombia','peru'],['colombia','brasil'],
    ['peru','brasil'],['peru','chile'],['peru','argentina'],
    ['brasil','argentina'],['brasil','uruguay'],['chile','argentina'],['chile','australia'],
    ['argentina','uruguay'],['brasil','sahara'],
    ['islandia','granbretana'],['islandia','suecia'],
    ['granbretana','espana'],['granbretana','alemania'],
    ['espana','francia'],['espana','sahara'],
    ['francia','alemania'],['francia','italia'],
    ['rusia','suecia'],['alemania','polonia'],['alemania','italia'],
    ['polonia','rusia'],['polonia','turquia'],['polonia','egipto'],
    ['rusia','iran'],['rusia','aral'],['rusia','turquia'],
    ['sahara','egipto'],['sahara','zaire'],['sahara','etiopia'],
    ['egipto','etiopia'],['egipto','israel'],
    ['zaire','etiopia'],['zaire','sudafrica'],['zaire','madagascar'],
    ['etiopia','sudafrica'],
    ['turquia','israel'],['turquia','iran'],
    ['tartaria','aral'],['tartaria','siberia'],['tartaria','taymir'],
    ['aral','siberia'],
    ['siberia','kamchatka'],['siberia','mongolia'],['siberia','taymir'],
    ['gobi','mongolia'],['gobi','china'],
    ['mongolia','china'],
    ['china','malasia'],['china','india'],
    ['india','iran'],['china','iran'],['gobi','iran'],['mongolia','iran'],
    ['aral','iran'],['turquia','egipto'],['madagascar','egipto'],
    ['arabia','turquia'],['arabia','israel'],
    ['japon','kamchatka'],
    ['kamchatka','alaska'],['china','siberia'],['china','japon'],
    ['malasia','india'],['malasia','borneo'],['china','kamchatka'],
    ['sumatra','australia'],['sumatra','india'],
    ['australia','borneo'],['australia','java'],
];

const adjMap = {};
COUNTRIES.forEach(c => adjMap[c.id] = []);
ADJACENCIES.forEach(([a, b]) => {
    if (!adjMap[a] || !adjMap[b]) return;
    if (!adjMap[a].includes(b)) adjMap[a].push(b);
    if (!adjMap[b].includes(a)) adjMap[b].push(a);
});

const COLORS = ['#00bcd4', '#c0392b', '#e91e63', '#f1c40f', '#27ae60', '#222222'];
const COLOR_NAMES = ['Cian', 'Rojo', 'Magenta', 'Amarillo', 'Verde', 'Negro'];

// =====================================================================
//  UTILIDADES
// =====================================================================
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function countryById(id) { return COUNTRIES.find(c => c.id === id); }
function getOwner(G, id) { return G.countries[id] ? G.countries[id].owner : -1; }
function getArmies(G, id) { return G.countries[id] ? G.countries[id].armies : 0; }
function playerCountries(G, idx) {
    const res = [];
    for (const [id, d] of Object.entries(G.countries)) if (d.owner === idx) res.push(id);
    return res;
}
function continentOwned(G, idx, contId) {
    if (idx < 0) return false;
    return COUNTRIES.filter(c => c.cont === contId).every(c => getOwner(G, c.id) === idx);
}
function getAdjacentCountries(id) { return adjMap[id] || []; }
function getEnemyAdjacent(G, id, idx) {
    return getAdjacentCountries(id).filter(a => { const o = getOwner(G, a); return o !== idx && o !== -1; });
}
function getFriendlyAdjacent(G, id, idx) { return getAdjacentCountries(id).filter(a => getOwner(G, a) === idx); }
function continentProgress(G, idx, contId) {
    const ids = COUNTRIES.filter(c => c.cont === contId).map(c => c.id);
    const owned = ids.filter(id => getOwner(G, id) === idx).length;
    return { owned, total: ids.length, missing: ids.length - owned };
}
function isHuman(G, idx) { return G.players[idx] && !G.players[idx].eliminated && G.players[idx].type === 'human'; }
function isAI(G, idx) { return G.players[idx] && !G.players[idx].eliminated && G.players[idx].type === 'ai'; }
function currentPlayer(G) { return G.players[G.currentPlayerIdx]; }
function formatBonusString(bonusObj) {
    const parts = [];
    for (const [contId, count] of Object.entries(bonusObj)) if (count > 0) parts.push(`${CONTINENTS[contId].name}: ${count}`);
    return parts.length ? parts.join(', ') : 'ninguno';
}

// =====================================================================
//  ESTADO DE PARTIDA (G) POR SALA
// =====================================================================
function crearEstadoVacio() {
    return {
        players: [],
        currentPlayerIdx: 0,
        phase: 'setup',
        countries: {},
        turnNumber: 1,
        attackFrom: null,
        attackTo: null,
        diceResults: null,
        lastCombat: null,
        combatDone: false,
        gameOver: false,
        winner: null,
        reinforceFrom: null,
        reinforceTo: null,
        placeInfo: null,
        pendingTransfer: null,
        log: []
    };
}

function inicializarPartida(G) {
    G.phase = 'play';
    G.turnNumber = 1;
    G.gameOver = false;
    G.winner = null;
    G.attackFrom = null;
    G.attackTo = null;
    G.diceResults = null;
    G.lastCombat = null;
    G.combatDone = false;
    G.reinforceFrom = null;
    G.reinforceTo = null;
    G.placeInfo = null;
    G.pendingTransfer = null;
    G.countries = {};

    const shuffled = shuffle([...COUNTRIES.map(c => c.id)]);
    const numPlayers = G.players.length;
    const perPlayer = Math.floor(shuffled.length / numPlayers);
    const remainder = shuffled.length % numPlayers;
    let idx = 0;
    for (let i = 0; i < numPlayers; i++) {
        const count = perPlayer + (i < remainder ? 1 : 0);
        for (let j = 0; j < count; j++) {
            G.countries[shuffled[idx++]] = { owner: i, armies: 1 };
        }
    }
    for (let i = 0; i < numPlayers; i++) {
        const cs = playerCountries(G, i);
        for (let a = 0; a < 5; a++) G.countries[cs[Math.floor(Math.random() * cs.length)]].armies += 1;
    }
    for (let i = 0; i < numPlayers; i++) {
        const cs = playerCountries(G, i);
        for (let a = 0; a < 3; a++) G.countries[cs[Math.floor(Math.random() * cs.length)]].armies += 1;
    }

    const rolls = G.players.map(() => Math.floor(Math.random() * 6) + 1);
    let maxRoll = -1, firstIdx = 0;
    for (let i = 0; i < rolls.length; i++) if (rolls[i] > maxRoll) { maxRoll = rolls[i]; firstIdx = i; }
    G.currentPlayerIdx = firstIdx;
    G.log.push("¡La batalla del TEG ha comenzado! Turno inicial: " + G.players[firstIdx].name);
}

// =====================================================================
//  TURNO
// =====================================================================
function startTurn(G, sala) {
    if (G.gameOver) return;
    G.phase = 'play';
    G.combatDone = false;
    G.attackFrom = null;
    G.attackTo = null;
    G.pendingTransfer = null;
    G.reinforceFrom = null;
    G.reinforceTo = null;
    G.diceResults = null;
    G.lastCombat = null;

    const idx = G.currentPlayerIdx;
    const p = G.players[idx];
    if (!p || p.eliminated) { nextTurn(G, sala); return; }

    const own = playerCountries(G, idx);
    if (own.length === 0) {
        p.eliminated = true;
        G.log.push(`${p.name} ha sido eliminado.`);
        broadcastSala(sala);
        if (!checkVictory(G, sala)) nextTurn(G, sala);
        return;
    }

    const normalFichas = Math.max(3, Math.floor(own.length / 2));
    const bonusFichas = {};
    let totalBonus = 0;
    for (const contId of Object.keys(CONTINENTS)) {
        if (continentOwned(G, idx, contId)) {
            bonusFichas[contId] = CONTINENTS[contId].bonus;
            totalBonus += CONTINENTS[contId].bonus;
        }
    }
    const totalFichas = normalFichas + totalBonus;
    G.placeInfo = { normal: normalFichas, bonus: bonusFichas, total: totalFichas, placed: 0 };

    if (totalFichas === 0) {
        broadcastSala(sala);
        if (isAI(G, idx)) scheduleAI(sala, idx);
        return;
    }

    G.phase = 'place';
    broadcastSala(sala);
    if (isAI(G, idx)) scheduleAI(sala, idx);
}

function nextTurn(G, sala) {
    if (checkVictory(G, sala)) return;
    let next = (G.currentPlayerIdx + 1) % G.players.length;
    let attempts = 0;
    while (G.players[next].eliminated && attempts < G.players.length) {
        next = (next + 1) % G.players.length;
        attempts++;
    }
    if (attempts >= G.players.length) { endGame(G, sala, -1); return; }
    G.currentPlayerIdx = next;
    G.turnNumber++;
    startTurn(G, sala);
}

function checkVictory(G, sala) {
    const active = G.players.filter(p => !p.eliminated);
    if (active.length === 1) { endGame(G, sala, active[0].id); return true; }
    return false;
}

function endGame(G, sala, winnerIdx) {
    G.gameOver = true;
    G.phase = 'gameover';
    G.winner = winnerIdx;
    const p = winnerIdx >= 0 ? G.players[winnerIdx] : null;
    if (p) G.log.push(`🏆 ¡${p.name} ha ganado!`);
    else G.log.push('🏆 Partida terminada.');
    broadcastSala(sala);
}

function endTurn(G, sala) {
    const idx = G.currentPlayerIdx;
    if (G.players[idx].eliminated) { nextTurn(G, sala); return; }
    if (G.pendingTransfer) G.pendingTransfer = null;
    G.phase = 'play';
    nextTurn(G, sala);
}

// =====================================================================
//  COLOCACIÓN
// =====================================================================
function handlePlaceClick(G, sala, id) {
    if (G.phase !== 'place') return;
    const idx = G.currentPlayerIdx;
    const info = G.placeInfo;
    if (!info || info.placed >= info.total) {
        G.phase = 'play';
        broadcastSala(sala);
        if (isAI(G, idx)) scheduleAI(sala, idx);
        return;
    }
    if (getOwner(G, id) !== idx) return;

    const contId = countryById(id).cont;
    if ((info.bonus[contId] || 0) > 0) {
        info.bonus[contId]--;
        info.placed++;
        G.countries[id].armies++;
    } else if (info.normal > 0) {
        info.normal--;
        info.placed++;
        G.countries[id].armies++;
    } else {
        return;
    }
    broadcastSala(sala);
    if (info.placed >= info.total) {
        G.phase = 'play';
        broadcastSala(sala);
        if (isAI(G, idx)) scheduleAI(sala, idx);
    }
}

// =====================================================================
//  REAGRUPAR
// =====================================================================
function startReinforce(G, sala) {
    const idx = G.currentPlayerIdx;
    const own = playerCountries(G, idx);
    let possible = false;
    for (const cid of own) {
        if (getArmies(G, cid) < 2) continue;
        if (getFriendlyAdjacent(G, cid, idx).length > 0) { possible = true; break; }
    }
    if (!possible) return;
    G.phase = 'reinforce';
    G.reinforceFrom = null;
    G.reinforceTo = null;
    broadcastSala(sala);
}

function processReinforceMove(G, sala, from, to) {
    const idx = G.currentPlayerIdx;
    if (G.phase !== 'reinforce') return;
    if (getOwner(G, from) !== idx || getOwner(G, to) !== idx) return;
    if (!getAdjacentCountries(from).includes(to)) return;
    if (getArmies(G, from) < 2) return;
    G.countries[from].armies -= 1;
    G.countries[to].armies += 1;
    G.reinforceFrom = from;
    G.reinforceTo = to;
    broadcastSala(sala);
}

// =====================================================================
//  COMBATE
// =====================================================================
function initiateAttack(G, sala, fromId, toId) {
    const idx = G.currentPlayerIdx;
    if (getOwner(G, fromId) !== idx) return false;
    if (getArmies(G, fromId) < 2) return false;
    if (getOwner(G, toId) === idx) return false;
    if (!getAdjacentCountries(fromId).includes(toId)) return false;

    G.attackFrom = fromId;
    G.attackTo = toId;
    G.phase = 'combat';
    G.diceResults = null;
    G.lastCombat = null;
    G.combatDone = false;
    G.pendingTransfer = null;
    broadcastSala(sala);
    return true;
}

function rollDice(G, sala) {
    if (G.phase !== 'combat' || G.combatDone) return;
    const fromId = G.attackFrom, toId = G.attackTo;
    if (!fromId || !toId) return;

    const attackerArmies = getArmies(G, fromId);
    const defenderArmies = getArmies(G, toId);
    if (attackerArmies < 2 || defenderArmies < 1) { cancelCombat(G, sala); return; }

    let attackDice = 1;
    if (attackerArmies >= 4) attackDice = 3;
    else if (attackerArmies >= 3) attackDice = 2;
    let defendDice = Math.min(3, defenderArmies);

    const aDice = [];
    for (let i = 0; i < attackDice; i++) aDice.push(Math.floor(Math.random() * 6) + 1);
    const dDice = [];
    for (let i = 0; i < defendDice; i++) dDice.push(Math.floor(Math.random() * 6) + 1);
    aDice.sort((a, b) => b - a);
    dDice.sort((a, b) => b - a);

    const pairs = Math.min(aDice.length, dDice.length);
    let aLoss = 0, dLoss = 0;
    const results = [];
    for (let i = 0; i < pairs; i++) {
        if (aDice[i] > dDice[i]) { dLoss++; results.push({ a: aDice[i], d: dDice[i], winner: 'attacker' }); }
        else { aLoss++; results.push({ a: aDice[i], d: dDice[i], winner: 'defender' }); }
    }
    G.lastCombat = { aDice, dDice, aLoss, dLoss, results };
    resolveCombat(G, sala, fromId, toId, aLoss, dLoss);
}

function resolveCombat(G, sala, fromId, toId, aLoss, dLoss) {
    const idx = G.currentPlayerIdx;
    const p = G.players[idx];
    G.countries[fromId].armies -= aLoss;
    G.countries[toId].armies -= dLoss;

    if (G.countries[toId].armies <= 0) {
        const fromArmies = G.countries[fromId].armies;
        if (fromArmies > 1) {
            G.countries[fromId].armies -= 1;
            G.countries[toId] = { owner: idx, armies: 1 };

            if (isHuman(G, idx)) {
                if (G.countries[fromId].armies > 1) {
                    G.pendingTransfer = { from: fromId, to: toId };
                }
                G.log.push(`✅ ${p.name} conquistó ${countryById(toId).name}.`);
                G.combatDone = true;
                G.phase = 'play';
                broadcastSala(sala);
                checkElimination(G, sala);
                return;
            } else {
                // IA transfiere
                let availableToMove = G.countries[fromId].armies - 1;
                let moveCount = 0;
                const toEnemies = getEnemyAdjacent(G, toId, idx);
                if (toEnemies.length > 0) moveCount = Math.min(3, availableToMove);
                else moveCount = Math.min(1, availableToMove);
                if (moveCount > 0) {
                    G.countries[fromId].armies -= moveCount;
                    G.countries[toId].armies += moveCount;
                }
                G.log.push(`🤖 ${p.name} conquistó ${countryById(toId).name}.`);
                G.combatDone = true;
                G.phase = 'play';
                broadcastSala(sala);
                checkElimination(G, sala);
                return;
            }
        } else {
            G.countries[toId].armies = 1;
            G.log.push(`❌ No se pudo ocupar ${countryById(toId).name} (solo 1 ficha).`);
            G.combatDone = true;
            broadcastSala(sala);
            return;
        }
    }

    if (G.countries[fromId].armies < 1) G.countries[fromId].armies = 1;
    if (G.countries[toId].armies < 1) G.countries[toId].armies = 1;

    if (G.countries[fromId].armies < 2) {
        G.combatDone = true;
    } else {
        G.combatDone = false;
    }
    broadcastSala(sala);
}

function cancelCombat(G, sala) {
    G.phase = 'play';
    G.attackFrom = null;
    G.attackTo = null;
    G.lastCombat = null;
    G.diceResults = null;
    broadcastSala(sala);
    if (isAI(G, G.currentPlayerIdx)) scheduleAI(sala, G.currentPlayerIdx);
}

function transferir(G, sala) {
    if (!G.pendingTransfer) return;
    const idx = G.currentPlayerIdx;
    const { from, to } = G.pendingTransfer;
    if (getArmies(G, from) < 2) { G.pendingTransfer = null; broadcastSala(sala); return; }
    if (getArmies(G, to) >= 3) { G.pendingTransfer = null; broadcastSala(sala); return; }
    G.countries[from].armies--;
    G.countries[to].armies++;
    if (getArmies(G, from) < 2 || getArmies(G, to) >= 3) {
        G.pendingTransfer = null;
    }
    broadcastSala(sala);
}

function checkElimination(G, sala) {
    const idx = G.currentPlayerIdx;
    for (let i = 0; i < G.players.length; i++) {
        if (i === idx || G.players[i].eliminated) continue;
        if (playerCountries(G, i).length === 0) {
            G.players[i].eliminated = true;
            G.log.push(`💀 ${G.players[i].name} eliminado.`);
            if (checkVictory(G, sala)) return;
        }
    }
}

// =====================================================================
//  IA (portada del cliente)
// =====================================================================
function getActiveHumanIndices(G) {
    const list = [];
    for (let i = 0; i < G.players.length; i++) if (isHuman(G, i)) list.push(i);
    return list;
}

function evaluatePlacementScore(G, cid, idx, contId) {
    let score = 0;
    const enemies = getEnemyAdjacent(G, cid, idx);
    const myArmies = getArmies(G, cid);
    if (enemies.length === 0) return -10000;
    for (const enemyId of enemies) {
        const enemyOwner = getOwner(G, enemyId);
        const enemyArmies = getArmies(G, enemyId);
        const enemyCont = countryById(enemyId).cont;
        const targetIsHuman = isHuman(G, enemyOwner);
        if (targetIsHuman) {
            score += 4000;
            if (continentOwned(G, enemyOwner, enemyCont)) {
                score += 8000 + (CONTINENTS[enemyCont].bonus * 1200);
                if (myArmies < enemyArmies + 2) score += 3500;
            } else {
                const pr = continentProgress(G, enemyOwner, enemyCont);
                if (pr.missing === 1) score += 6500 + (CONTINENTS[enemyCont].bonus * 900);
                else if (pr.missing === 2) score += 3500;
            }
            if (enemyArmies <= 2) score += 2500;
            if (enemyArmies >= 5 && myArmies < enemyArmies) score += 3000;
        } else {
            score += 200;
            if (continentOwned(G, enemyOwner, enemyCont)) score += 1000;
        }
    }
    const aiContProg = continentProgress(G, idx, contId);
    if (!continentOwned(G, idx, contId)) {
        if (aiContProg.missing === 1) score += 7500 + (CONTINENTS[contId].bonus * 1200);
        else if (aiContProg.missing === 2) score += 4500 + (CONTINENTS[contId].bonus * 700);
    } else {
        const externalEnemies = enemies.filter(e => countryById(e).cont !== contId);
        if (externalEnemies.length > 0) score += 3000;
    }
    score += Math.min(myArmies, 15) * 50;
    return score;
}

function aiPlace(G, sala, idx) {
    if (G.phase !== 'place') return;
    const info = G.placeInfo;
    if (!info) return;
    const own = playerCountries(G, idx);
    if (own.length === 0) { G.phase = 'play'; broadcastSala(sala); scheduleAI(sala, idx); return; }

    for (const contId of Object.keys(info.bonus)) {
        while (info.bonus[contId] > 0) {
            const contCountries = own.filter(cid => countryById(cid).cont === contId);
            if (contCountries.length === 0) { info.bonus[contId] = 0; break; }
            let bestCountry = contCountries[0], maxScore = -99999;
            for (const cid of contCountries) {
                const score = evaluatePlacementScore(G, cid, idx, contId);
                if (score > maxScore) { maxScore = score; bestCountry = cid; }
            }
            info.bonus[contId]--;
            info.placed++;
            G.countries[bestCountry].armies++;
        }
    }
    while (info.normal > 0) {
        let bestCountry = own[0], maxScore = -99999;
        for (const cid of own) {
            const score = evaluatePlacementScore(G, cid, idx, countryById(cid).cont);
            if (score > maxScore) { maxScore = score; bestCountry = cid; }
        }
        info.normal--;
        info.placed++;
        G.countries[bestCountry].armies++;
    }
    info.placed = info.total;
    G.phase = 'play';
    G.log.push(`🤖 ${G.players[idx].name} desplegó sus tropas.`);
    broadcastSala(sala);
    scheduleAI(sala, idx);
}

function aiBestAttack(G, idx) {
    const own = playerCountries(G, idx);
    const candidates = [];
    for (const fromId of own) {
        const fromArmies = getArmies(G, fromId);
        if (fromArmies < 2) continue;
        for (const toId of getEnemyAdjacent(G, fromId, idx)) {
            const toArmies = getArmies(G, toId);
            const targetOwner = getOwner(G, toId);
            const targetIsHuman = isHuman(G, targetOwner);
            const targetCont = countryById(toId).cont;
            const isHumanContinent = targetIsHuman && continentOwned(G, targetOwner, targetCont);
            const humanProgress = targetIsHuman ? continentProgress(G, targetOwner, targetCont) : null;
            const isHumanNearCont = humanProgress && humanProgress.missing <= 2;
            const aiProgress = continentProgress(G, idx, targetCont);
            const isAiNearCont = aiProgress.missing <= 2;
            let minArmiesNeeded = toArmies + 1;
            if (isHumanContinent || isAiNearCont || isHumanNearCont) {
                if (toArmies === 1) minArmiesNeeded = 2;
                else if (toArmies === 2) minArmiesNeeded = 3;
                else if (toArmies === 3) minArmiesNeeded = 4;
                else minArmiesNeeded = toArmies + 1;
            } else {
                if (toArmies === 1) minArmiesNeeded = 3;
                else if (toArmies === 2) minArmiesNeeded = 4;
                else if (toArmies === 3) minArmiesNeeded = 5;
                else minArmiesNeeded = Math.ceil(toArmies * 1.25) + 1;
            }
            if (fromArmies < minArmiesNeeded) continue;
            let score = 0;
            const armyMargin = fromArmies - toArmies;
            if (targetIsHuman) {
                score += 5000;
                if (isHumanContinent) score += 12000 + (CONTINENTS[targetCont].bonus * 2000);
                if (isHumanNearCont) score += 7000 + (CONTINENTS[targetCont].bonus * 1000);
                const humanTerritories = playerCountries(G, targetOwner).length;
                if (humanTerritories <= 3) score += 15000;
                else if (humanTerritories <= 6) score += 4000;
            } else {
                const activeHumans = getActiveHumanIndices(G);
                score += activeHumans.length > 0 ? 100 : 2000;
            }
            if (continentOwned(G, idx, targetCont)) score += 4000;
            else {
                if (aiProgress.missing === 1) score += 10000 + (CONTINENTS[targetCont].bonus * 1500);
                else if (aiProgress.missing === 2) score += 5000 + (CONTINENTS[targetCont].bonus * 800);
            }
            if (toArmies === 1 && fromArmies >= 3) score += 3500;
            score += armyMargin * 150;
            score += (fromArmies / Math.max(1, toArmies)) * 200;
            candidates.push({ from: fromId, to: toId, score, margin: armyMargin });
        }
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0];
}

function aiReinforce(G, idx) {
    let totalMoves = 0;
    for (let iter = 0; iter < 15; iter++) {
        let bestScore = -Infinity, bestFrom = null, bestTo = null, bestAmount = 0;
        const ownCountries = playerCountries(G, idx);
        for (const from of ownCountries) {
            const fromArmies = getArmies(G, from);
            if (fromArmies < 2) continue;
            for (const to of getFriendlyAdjacent(G, from, idx)) {
                const toEnemies = getEnemyAdjacent(G, to, idx);
                const fromEnemies = getEnemyAdjacent(G, from, idx);
                let score = 0;
                const toHasHumanEnemies = toEnemies.some(eid => isHuman(G, getOwner(G, eid)));
                const fromHasHumanEnemies = fromEnemies.some(eid => isHuman(G, getOwner(G, eid)));
                if (fromEnemies.length === 0 && toEnemies.length > 0) score += 10000;
                if (toHasHumanEnemies) score += 5000;
                if (fromHasHumanEnemies && fromArmies <= 3) score -= 4000;
                score += toEnemies.length * 300;
                if (score > bestScore && score > 100) {
                    bestScore = score; bestFrom = from; bestTo = to;
                    bestAmount = (fromEnemies.length === 0) ? (fromArmies - 1) : Math.floor((fromArmies - 1) / 2);
                }
            }
        }
        if (bestFrom === null || bestAmount <= 0) break;
        G.countries[bestFrom].armies -= bestAmount;
        G.countries[bestTo].armies += bestAmount;
        totalMoves += bestAmount;
    }
    return totalMoves;
}

function scheduleAI(sala, idx) {
    if (sala.aiTimeout) clearTimeout(sala.aiTimeout);
    sala.aiTimeout = setTimeout(() => aiTurn(sala, idx), 700);
}

function aiTurn(sala, idx) {
    const G = sala.G;
    if (G.gameOver || !isAI(G, idx) || G.currentPlayerIdx !== idx) return;

    let attacks = 0;
    const maxAttacks = 30;
    let guard = 0;
    while (attacks < maxAttacks && !G.gameOver && !G.players[idx].eliminated && guard++ < 200) {
        const best = aiBestAttack(G, idx);
        if (!best) break;
        if (!initiateAttack(G, sala, best.from, best.to)) break;
        let safety = 25;
        while (G.phase === 'combat' && !G.combatDone && safety-- > 0) {
            rollDice(G, sala);
        }
        G.phase = 'play';
        G.attackFrom = null;
        G.attackTo = null;
        G.lastCombat = null;
        attacks++;
        if (G.gameOver) break;
    }

    if (G.gameOver) { broadcastSala(sala); return; }

    const moved = aiReinforce(G, idx);
    if (moved > 0) G.log.push(`🤖 ${G.players[idx].name} movió ${moved} tropas.`);
    else G.log.push(`🤖 ${G.players[idx].name} finalizó su turno.`);
    broadcastSala(sala);

    if (!G.gameOver && !G.players[idx].eliminated) {
        endTurn(G, sala);
    } else if (!G.gameOver) {
        nextTurn(G, sala);
    }
}

// =====================================================================
//  SALA
// =====================================================================
class Sala {
    constructor(id) {
        this.id = id;
        this.jugadores = []; // { id(socketId|bot), nombre, color, colorName, tipo, eliminado, idx }
        this.estado = 'esperando';
        this.hostId = null;
        this.G = null;
        this.aiTimeout = null;
    }

    getLobbyData() {
        return {
            id: this.id,
            estado: this.estado,
            hostId: this.hostId,
            jugadores: this.jugadores.map(j => ({
                id: j.id, nombre: j.nombre, color: j.color, tipo: j.tipo, esBot: j.tipo === 'ai'
            }))
        };
    }

    addPlayer(socketId, nombre) {
        if (this.estado !== 'esperando') return { ok: false, error: 'La partida ya comenzó.' };
        if (this.jugadores.length >= 6) return { ok: false, error: 'Sala llena (máx 6).' };
        if (this.jugadores.find(j => j.id === socketId)) return { ok: true };
        const i = this.jugadores.length;
        this.jugadores.push({
            id: socketId,
            nombre: nombre || `Jugador ${i + 1}`,
            color: COLORS[i % COLORS.length],
            colorName: COLOR_NAMES[i % COLOR_NAMES.length],
            tipo: 'human',
            eliminado: false,
            idx: i
        });
        if (!this.hostId) this.hostId = socketId;
        return { ok: true };
    }

    addBot() {
        if (this.estado !== 'esperando') return { ok: false };
        if (this.jugadores.length >= 6) return { ok: false };
        const i = this.jugadores.length;
        this.jugadores.push({
            id: `bot_${Math.random().toString(36).slice(2, 11)}`,
            nombre: `🤖 IA ${i + 1}`,
            color: COLORS[i % COLORS.length],
            colorName: COLOR_NAMES[i % COLOR_NAMES.length],
            tipo: 'ai',
            eliminado: false,
            idx: i
        });
        return { ok: true };
    }

    startGame() {
        if (this.estado !== 'esperando') return { ok: false };
        if (this.jugadores.length < 2) return { ok: false, error: 'Se necesitan al menos 2 jugadores.' };
        this.estado = 'jugando';
        this.G = crearEstadoVacio();
        this.G.players = this.jugadores.map((j, i) => ({
            name: j.nombre,
            type: j.tipo,
            color: j.color,
            colorName: j.colorName,
            eliminated: false,
            id: i
        }));
        inicializarPartida(this.G);
        broadcastSala(this);
        startTurn(this.G, this);
        return { ok: true };
    }

    getPlayerIdxBySocket(socketId) {
        const j = this.jugadores.find(x => x.id === socketId);
        return j ? j.idx : -1;
    }
}

const SALAS = {};

function broadcastSala(sala) {
    if (sala.estado === 'esperando') {
        io.to(sala.id).emit('actualizar_sala', sala.getLobbyData());
    } else if (sala.G) {
        io.to(sala.id).emit('estado_actualizado', { estado: sala.G });
    }
}

// =====================================================================
//  SOCKET
// =====================================================================
io.on('connection', (socket) => {
    console.log('Conectado:', socket.id);

    socket.on('crear_o_unirse', ({ salaId, nombreJugador }) => {
        salaId = (salaId || '').toUpperCase();
        if (!salaId) { socket.emit('error_juego', 'Sala inválida.'); return; }

        if (!SALAS[salaId]) SALAS[salaId] = new Sala(salaId);
        const sala = SALAS[salaId];

        const res = sala.addPlayer(socket.id, nombreJugador);
        if (!res.ok) { socket.emit('error_juego', res.error); return; }

        socket.join(salaId);
        socket.data.salaId = salaId;

        io.to(salaId).emit('actualizar_sala', sala.getLobbyData());

        // Si la partida ya empezó, enviamos el estado actual
        if (sala.estado === 'jugando' && sala.G) {
            const idx = sala.getPlayerIdxBySocket(socket.id);
            socket.emit('partida_iniciada', { estado: sala.G, miIndice: idx });
        }
    });

    socket.on('agregar_bot', ({ salaId }) => {
        const sala = SALAS[(salaId || '').toUpperCase()];
        if (!sala) return;
        if (sala.hostId !== socket.id) return;
        sala.addBot();
        io.to(sala.id).emit('actualizar_sala', sala.getLobbyData());
    });

    socket.on('iniciar_partida', ({ salaId }) => {
        const sala = SALAS[(salaId || '').toUpperCase()];
        if (!sala) return;
        if (sala.hostId !== socket.id) return;
        const res = sala.startGame();
        if (!res.ok) socket.emit('error_juego', res.error || 'No se pudo iniciar.');
    });

    socket.on('accion', ({ salaId, accion }) => {
        const sala = SALAS[(salaId || '').toUpperCase()];
        if (!sala || !sala.G || sala.estado !== 'jugando') return;
        const G = sala.G;
        const idx = sala.getPlayerIdxBySocket(socket.id);
        if (idx < 0 || idx !== G.currentPlayerIdx) return;
        if (G.gameOver) return;
        if (G.players[idx].type !== 'human') return;

        switch (accion.tipo) {
            case 'colocar':
                handlePlaceClick(G, sala, accion.pais);
                break;
            case 'iniciar_reagrupe':
                startReinforce(G, sala);
                break;
            case 'reagrupar':
                processReinforceMove(G, sala, accion.desde, accion.hacia);
                break;
            case 'atacar':
                initiateAttack(G, sala, accion.desde, accion.hacia);
                break;
            case 'tirar_dados':
                rollDice(G, sala);
                break;
            case 'terminar_combate':
                cancelCombat(G, sala);
                break;
            case 'transferir':
                transferir(G, sala);
                break;
            case 'finalizar_turno':
                endTurn(G, sala);
                break;
        }
    });

    socket.on('disconnect', () => {
        const salaId = socket.data.salaId;
        if (!salaId) return;
        const sala = SALAS[salaId];
        if (!sala) return;

        const idx = sala.getPlayerIdxBySocket(socket.id);
        if (idx < 0) return;

        // Si estamos en espera, lo quitamos. Si estamos jugando, lo eliminamos.
        if (sala.estado === 'esperando') {
            sala.jugadores = sala.jugadores.filter(j => j.id !== socket.id);
            sala.jugadores.forEach((j, i) => { j.idx = i; });
            if (sala.hostId === socket.id) sala.hostId = sala.jugadores[0] ? sala.jugadores[0].id : null;
            if (sala.jugadores.length === 0) { delete SALAS[salaId]; return; }
            io.to(salaId).emit('actualizar_sala', sala.getLobbyData());
        } else if (sala.G) {
            sala.G.players[idx].eliminated = true;
            sala.G.log.push(`💀 ${sala.G.players[idx].name} se desconectó.`);
            if (sala.G.currentPlayerIdx === idx) {
                // Pasar turno
                if (sala.aiTimeout) clearTimeout(sala.aiTimeout);
                nextTurn(sala.G, sala);
            } else {
                broadcastSala(sala);
            }
            checkVictory(sala.G, sala);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor TEG corriendo en puerto ${PORT}`);
});
