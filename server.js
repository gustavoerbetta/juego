// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuramos CORS para que tu dominio de Freehostia pueda conectarse sin bloqueos de seguridad
const io = new Server(server, {
    cors: {
        origin: "http://libertadfinanciera.com.ar",
        methods: ["GET", "POST"]
    }
});

const SALAS = {};

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on('crear_o_unirse', ({ salaId, nombreJugador }) => {
        socket.join(salaId);
        
        if (!SALAS[salaId]) {
            SALAS[salaId] = {
                id: salaId,
                jugadores: [],
                estado: 'esperando',
                turnoActual: 0,
                historial: []
            };
        }

        const sala = SALAS[salaId];

        if (sala.estado !== 'esperando') {
            socket.emit('error_juego', 'La partida ya comenzó.');
            return;
        }

        if (sala.jugadores.length >= 4) {
            socket.emit('error_juego', 'La sala está llena (máximo 4 jugadores).');
            return;
        }

        const nuevoJugador = {
            id: socket.id,
            nombre: nombreJugador || `Jugador ${sala.jugadores.length + 1}`,
            color: ['🔴 Rojo', '🔵 Azul', '🟢 Verde', '🟡 Amarillo'][sala.jugadores.length],
            esBot: false,
            paises: [],
            tropasDisponibles: 5
        };

        sala.jugadores.push(nuevoJugador);
        io.to(salaId).emit('actualizar_sala', sala);
    });

    socket.on('agregar_bot', ({ salaId }) => {
        const sala = SALAS[salaId];
        if (!sala || sala.jugadores.length >= 4) return;

        const nuevoBot = {
            id: `bot_${Math.random().toString(36).substr(2, 9)}`,
            nombre: `🤖 Bot ${sala.jugadores.length + 1}`,
            color: ['🔴 Rojo', '🔵 Azul', '🟢 Verde', '🟡 Amarillo'][sala.jugadores.length],
            esBot: true,
            paises: [],
            tropasDisponibles: 5
        };

        sala.jugadores.push(nuevoBot);
        io.to(salaId).emit('actualizar_sala', sala);
    });

    socket.on('iniciar_partida', ({ salaId }) => {
        const sala = SALAS[salaId];
        if (!sala) return;

        sala.estado = 'jugando';
        sala.historial.push("¡La batalla del TEG ha comenzado!");
        
        // Simulación inicial de reparto de países de muestra para el TEG
        sala.jugadores.forEach((jug, index) => {
            jug.paises = [`País Alpha ${index + 1}`, `País Beta ${index + 1}`];
        });

        io.to(salaId).emit('partida_iniciada', sala);
        verificarTurnoBot(salaId);
    });

    socket.on('atacar', ({ salaId, desde, hacia }) => {
        const sala = SALAS[salaId];
        if (!sala) return;

        const jugadorActual = sala.jugadores[sala.turnoActual];
        if (jugadorActual.id !== socket.id) return;

        // Lógica de combate simplificada con dados (1 dado cada uno)
        const dadoAtaque = Math.floor(Math.random() * 6) + 1;
        const dadoDefensa = Math.floor(Math.random() * 6) + 1;
        let resultado = "";

        if (dadoAtaque > dadoDefensa) {
            resultado = `⚔️ ${jugadorActual.nombre} atacó desde ${desde} a ${hacia}. ¡Ganó el ataque! (Dados: ${dadoAtaque} vs ${dadoDefensa})`;
        } else {
            resultado = `🛡️ ${jugadorActual.nombre} atacó desde ${desde} a ${hacia}. ¡La defensa resistió! (Dados: ${dadoAtaque} vs ${dadoDefensa})`;
        }

        sala.historial.push(resultado);
        io.to(salaId).emit('actualizar_juego', sala);
    });

    socket.on('finalizar_turno', ({ salaId }) => {
        const sala = SALAS[salaId];
        if (!sala) return;

        const jugadorActual = sala.jugadores[sala.turnoActual];
        if (jugadorActual.id !== socket.id && !jugadorActual.esBot) return;

        sala.turnoActual = (sala.turnoActual + 1) % sala.jugadores.length;
        sala.historial.push(`Es el turno de ${sala.jugadores[sala.turnoActual].nombre}`);
        
        io.to(salaId).emit('actualizar_juego', sala);
        verificarTurnoBot(salaId);
    });

    function verificarTurnoBot(salaId) {
        const sala = SALAS[salaId];
        if (!sala || sala.estado !== 'jugando') return;

        const jugadorActual = sala.jugadores[sala.turnoActual];
        if (jugadorActual && jugadorActual.esBot) {
            sala.historial.push(`${jugadorActual.nombre} está pensando su jugada...`);
            io.to(salaId).emit('actualizar_juego', sala);

            // El bot piensa durante 2.5 segundos y ejecuta su acción de forma automática
            setTimeout(() => {
                sala.historial.push(`🤖 ${jugadorActual.nombre} decidió pasar su turno defensivamente.`);
                sala.turnoActual = (sala.turnoActual + 1) % sala.jugadores.length;
                sala.historial.push(`Es el turno de ${sala.jugadores[sala.turnoActual].nombre}`);
                io.to(salaId).emit('actualizar_juego', sala);
                verificarTurnoBot(salaId);
            }, 2500);
        }
    }

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
        // Limpieza automática de salas vacías al desconectarse los jugadores
        for (const salaId in SALAS) {
            SALAS[salaId].jugadores = SALAS[salaId].jugadores.filter(j => j.id !== socket.id);
            if (SALAS[salaId].jugadores.length === 0) {
                delete SALAS[salaId];
            } else {
                io.to(salaId).emit('actualizar_sala', SALAS[salaId]);
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor de juego TEG corriendo en puerto ${PORT}`);
});