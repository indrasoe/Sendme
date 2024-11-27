function saveMessage(to, messageContent, email, callback) {
    console.log('Executing query to save message:', to, messageContent, email); // Tambahkan log ini
    const query = `INSERT INTO sendme ("to", message, email) VALUES (?, ?, ?)`;
    db.run(query, [to, messageContent, email], function (err) {
        if (err) {
            console.error('Error saving message:', err.message);
            callback(err);
        } else {
            console.log('Message saved with ID:', this.lastID); // Tambahkan log ini
            callback(null, this.lastID);
        }
    });
}
