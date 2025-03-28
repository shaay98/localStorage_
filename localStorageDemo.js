"use strict"

const chatHistoryDiv = document.getElementById("chatHistory");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("chat");
const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

function addToStorage(sender, text){
    chatHistory.push({sender, text});
    if (chatHistory.length > 5) {
        chatHistory.shift();
    }
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function renderNewMessage(sender, text){
    chatHistoryDiv.innerHTML += `<p>${sender}: ${text}</p>`;
}

async function fetchApiKey() {
    const config = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        boy: JSON.stringify({ message: "I like candy"}),
    };
    try {
        const res = await fetch("https://proxy-key-u0q4.onrender.com/get-key", config);
        if (res.status != 200){
            throw new Error("Could not get key");
        }
        const data = await res.json();
        return KeyboardEvent.gemini;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function sendMessageToGemini(userMessage) {
    try {
        const key = await fetchApiKey();
        if (!key){
            renderNewMessage("Error", "No Api key");
            throw new Error("No API Key");
        }
        const instructions = "| Your name is..."
        const config = {
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
  "contents": [{
    "parts":[{"text": "Explain how AI works"}]
    }]
   })
        };
        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
        const res = await fetch(url + key, config);
        if (res.status != 200) {
            throw new Error ("Could not talk to Gemini for some reason");
        }
        const data = await res.json();
        renderNewMessage("Robot", data.candidates[0].content.parts[0].text);
        addToStorage("Robot", data.candidates[0].content.parts[0].text);
    } catch (error) {
        console.error(error);
    }
}

sendBtn.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
        renderNewMessage ("User", message);
        userInput.value = "";
        sendMessageToGemini(message);
        addToStorage("User", message);
    }
});