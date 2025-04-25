document.getElementById('send-btn').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim()) {
        addUserMessage(userInput);
        document.getElementById('user-input').value = '';
        processMessage(userInput);
    }
});

document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const userInput = document.getElementById('user-input').value;
        if (userInput.trim()) {
            addUserMessage(userInput);
            document.getElementById('user-input').value = '';
            processMessage(userInput);
        }
    }
});

function addUserMessage(message) {
    const chatBody = document.getElementById('chat-body');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', 'user');
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addBotMessage(message) {
    const chatBody = document.getElementById('chat-body');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', 'bot');
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function processMessage(message) {
    if (message.toLowerCase().includes('hello')) {
        addBotMessage('Hello! How can I help you today?');
    } else if (message.toLowerCase().includes('invoice')) {
        addBotMessage('Sure! Let me generate an invoice for you.');
    } else {
        addBotMessage('Sorry, I didn\'t understand that. Can you please clarify?');
    }
}
