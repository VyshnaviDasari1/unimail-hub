// Get email id from URL
const params = new URLSearchParams(window.location.search);
const emailId = params.get("id");

// Fetch email details
fetch(`http://localhost:8080/api/emails/${emailId}`)
    .then(res => res.json())
    .then(email => {
        document.getElementById("sender").innerText = email.sender;
        document.getElementById("subject").innerText = email.subject;
        document.getElementById("body").innerText = email.body;

        // Mark email as read
        fetch(`http://localhost:8080/api/emails/${emailId}/read`, {
            method: "PUT"
        });
    })
    .catch(err => {
        alert("Failed to load email");
        console.error(err);
    });
