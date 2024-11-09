document.getElementById("sendMessageForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const to = document.getElementById("to").value;
    const email = document.getElementById("email").value;  // Opsional
    const message = document.getElementById("message").value;

    fetch("send_email.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `to=${encodeURIComponent(to)}&email=${encodeURIComponent(email)}&message=${encodeURIComponent(message)}`
    })
    .then(response => response.text())
    .then(data => {
        alert(data);  // Memberi tahu pengguna tentang status pengiriman
        document.getElementById("sendMessageForm").reset();
    })
    .catch(error => console.error("Terjadi kesalahan:", error));
});
