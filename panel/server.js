const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Docker = require('dockerode');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const CONTAINER_NAME = process.env.CONTAINER_NAME || 'hytale-server';
const PORT = process.env.PANEL_PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let container = null;
let execStream = null;

async function getContainer() {
    if (!container) {
        container = docker.getContainer(CONTAINER_NAME);
    }
    return container;
}

async function getContainerStatus() {
    try {
        const c = await getContainer();
        const info = await c.inspect();
        return {
            running: info.State.Running,
            status: info.State.Status,
            startedAt: info.State.StartedAt,
            health: info.State.Health?.Status || 'unknown'
        };
    } catch (e) {
        return { running: false, status: 'not found', error: e.message };
    }
}

io.on('connection', async (socket) => {
    console.log('Client connected');

    // Send initial status
    socket.emit('status', await getContainerStatus());

    // Stream logs
    try {
        const c = await getContainer();
        const logStream = await c.logs({
            follow: true,
            stdout: true,
            stderr: true,
            tail: 100,
            timestamps: true
        });

        logStream.on('data', (chunk) => {
            // Remove Docker stream header (8 bytes)
            const text = chunk.slice(8).toString('utf8');
            socket.emit('log', text);
        });

        socket.on('disconnect', () => {
            logStream.destroy();
        });
    } catch (e) {
        socket.emit('error', 'Failed to connect to container: ' + e.message);
    }

    // Handle commands
    socket.on('command', async (cmd) => {
        try {
            const c = await getContainer();
            const exec = await c.exec({
                Cmd: ['sh', '-c', `echo "${cmd}" > /tmp/hytale-console 2>/dev/null || echo "${cmd}"`],
                AttachStdout: true,
                AttachStderr: true
            });
            
            const stream = await exec.start();
            let output = '';
            
            stream.on('data', (chunk) => {
                output += chunk.slice(8).toString('utf8');
            });
            
            stream.on('end', () => {
                socket.emit('command-result', { cmd, output: output || 'Command sent' });
            });
        } catch (e) {
            socket.emit('command-result', { cmd, error: e.message });
        }
    });

    // Status updates
    const statusInterval = setInterval(async () => {
        socket.emit('status', await getContainerStatus());
    }, 5000);

    socket.on('disconnect', () => {
        clearInterval(statusInterval);
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Hytale Panel running on http://localhost:${PORT}`);
});
