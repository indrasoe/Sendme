const sqlite3 = require('sqlite3').verbose();
const WebSocket = require('ws');

// Hubungkan ke database SQLite
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Buat tabel "sendme" jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS sendme (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "to" TEXT NOT NULL,
    message TEXT NOT NULL,
    email TEXT
)`);

// Inisialisasi WebSocket Server
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('WebSocket server running on ws://localhost:8080');
});

// Fungsi untuk menyimpan pesan ke database
function saveMessage(to, messageContent, email, callback) {
    const query = `INSERT INTO sendme ("to", message, email) VALUES (?, ?, ?)`;
    db.run(query, [to, messageContent, email], function (err) {
        if (err) {
            console.error('Error saving message:', err.message);
            callback(err);
        } else {
            console.log('Message saved with ID:', this.lastID);
            callback(null, this.lastID);
        }
    });
}

// Fungsi untuk mengambil semua pesan dari database
function getMessages(callback) {
    const query = `SELECT * FROM sendme`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving messages:', err.message);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

// Event ketika klien terhubung ke WebSocket
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Event ketika menerima pesan dari klien
    ws.on('message', (message) => {
        const request = JSON.parse(message);

        if (request.action === 'addMessage') {
            // Simpan pesan ke database
            saveMessage(request.to, request.messageContent, request.email, (err, id) => {
                if (err) {
                    ws.send(JSON.stringify({ status: 'error', message: 'Failed to save message' }));
                } else {
                    ws.send(JSON.stringify({ status: 'success', message: 'Message saved', id }));
                }
            });
        } else if (request.action === 'getMessages') {
            // Ambil semua pesan dari database
            getMessages((err, rows) => {
                if (err) {
                    ws.send(JSON.stringify({ status: 'error', message: 'Failed to retrieve messages' }));
                } else {
                    ws.send(JSON.stringify({ status: 'success', data: rows }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Hubungkan ke WebSocket server
const ws = new WebSocket('ws://localhost:8080'); // Sesuaikan URL jika server Anda online

// Kirim data dari formulir ke server
document.getElementById('sendMessageForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const to = document.getElementById('to').value;
    const messageContent = document.getElementById('message').value;
    const email = document.getElementById('email').value;

    // Kirim data ke server
    ws.send(JSON.stringify({ action: 'addMessage', to, messageContent, email }));

    // Reset formulir setelah mengirim
    document.getElementById('sendMessageForm').reset();
});

// Tampilkan daftar pesan saat halaman dimuat
function loadMessages() {
    ws.send(JSON.stringify({ action: 'getMessages' }));

    ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.status === 'success' && response.data) {
            const messages = response.data;
            const messagesContainer = document.getElementById('messagesList');
            messagesContainer.innerHTML = ''; // Kosongkan daftar sebelumnya

            messages.forEach((msg) => {
                const messageItem = document.createElement('div');
                messageItem.innerHTML = `
                    <strong>Kepada:</strong> ${msg.to} <br>
                    <strong>Pesan:</strong> ${msg.message} <br>
                    <strong>Email:</strong> ${msg.email || 'Tidak ada'}
                `;
                messagesContainer.appendChild(messageItem);
            });
        }
    };
}

// Panggil fungsi untuk memuat pesan saat halaman dibuka
window.onload = loadMessages;

    ws.on('message', (message) => {
    console.log('Message received from client:', message); // Tambahkan log ini
    const request = JSON.parse(message);

    if (request.action === 'addMessage') {
        // Simpan pesan ke database
        console.log('Saving message:', request); // Tambahkan log ini
        saveMessage(request.to, request.messageContent, request.email, (err, id) => {
            if (err) {
                ws.send(JSON.stringify({ status: 'error', message: 'Failed to save message' }));
            } else {
                ws.send(JSON.stringify({ status: 'success', message: 'Message saved', id }));
            }
        });
    }
});


});
