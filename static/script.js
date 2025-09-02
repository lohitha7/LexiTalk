document.getElementById("defineBtn").addEventListener("click", () => {
    const word = document.getElementById("wordInput").value.trim();
    if (!word) return alert("Please enter a word!");

    fetch("/define", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `word=${word}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.getElementById("result").innerHTML = `<p style="color:red">${data.error}</p>`;
            return;
        }

        // Display definitions and emoji
        let html = `<h3>Word: ${data.word} ${data.emoji}</h3>`;
        html += `<p>Number of meanings: ${data.num_meanings}</p>`;
        html += "<ol>";
        data.definitions.forEach(def => {
            html += `<li>${def}</li>`;
        });
        html += "</ol>";

        // Add "Do you want to enter another word?" buttons
        html += `
            <div id="nextWordDiv" style="margin-top:20px;">
                <p>Do you want to enter another word?</p>
                <button id="yesBtn">Yes</button>
                <button id="noBtn">No</button>
            </div>
        `;

        document.getElementById("result").innerHTML = html;

        // Handle Yes button
        document.getElementById("yesBtn").addEventListener("click", () => {
            document.getElementById("wordInput").value = "";
            document.getElementById("result").innerHTML = "";
            document.getElementById("wordInput").focus();
        });

        // Handle No button
        document.getElementById("noBtn").addEventListener("click", () => {
            document.getElementById("result").innerHTML = "<p>Thank you!</p>";
            document.getElementById("wordInput").disabled = true;
            document.getElementById("defineBtn").disabled = true;
            document.getElementById("speakBtn").disabled = true;
        });
    });
});

document.getElementById("speakBtn").addEventListener("click", () => {
    const text = document.getElementById("wordInput").value.trim();
    if (!text) return alert("Please enter a word to speak!");

    fetch("/speak", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `text=${text}`
    })
    .then(res => res.json())
    .then(data => console.log(data.status));
});
