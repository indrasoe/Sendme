const WebSocket = require('ws'); // Import WebSocket
const wss = new WebSocket.Server({ port: 8080 }); // Server WebSocket di port 8080

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    // Ketika server menerima pesan dari klien
    ws.on('message', (message) => {
        console.log('Received message: ' + message);

        // Kirim pesan ke semua klien yang terhubung
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message); // Kirim pesan ke semua klien
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on ws://localhost:8080');
