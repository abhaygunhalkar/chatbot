document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const openButton = document.getElementById('chatbot-open-btn');
    const closeButton = document.getElementById('chatbot-close-btn');
    const conversationDiv = document.getElementById('chatbot-conversation');
    const inputField = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');

    // Initially hide the chatbot container and show the open button
    chatbotContainer.style.display = 'none';
    openButton.style.display = 'block';

    // Event listener for the "Open" button
    if (openButton) {
        openButton.addEventListener('click', () => {
            chatbotContainer.style.display = 'block';
            openButton.style.display = 'none'; // Hide the open button
        });
    } else {
        console.error("Open button element not found!");
    }

    // Event listener for the "Close" button
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
            openButton.style.display = 'block'; // Show the open button
        });
    } else {
        console.error("Close button element not found!");
    }

    sendBtn.addEventListener('click', () => {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            addUserMessage(userMessage);
            inputField.value = '';

            fetch('http://localhost:5000/get_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: userMessage })
            })
            .then(response => response.json())
            .then(data => {
                addBotMessage(data.answer);
            })
            .catch(error => {
                console.error("Error sending question to backend:", error);
                addBotMessage("Sorry, there was an error processing your request.");
            });
        }
    });

    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && inputField.value.trim()) {
            sendBtn.click();
        }
    });

    function addUserMessage(message) {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-message');
        userDiv.textContent = message;
        conversationDiv.appendChild(userDiv);
        conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }

    function addBotMessage(message) {
        const botDiv = document.createElement('div');
        botDiv.classList.add('bot-message');
        botDiv.textContent = message;
        conversationDiv.appendChild(botDiv);
        conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }
});