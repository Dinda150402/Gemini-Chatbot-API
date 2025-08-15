document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const apiBaseUrl = 'http://localhost:3000'; // Your backend server URL

    /**
     * Appends a message to the chat box and scrolls to the bottom.
     * @param {string} text The message text.
     * @param {string} sender The sender of the message, 'user' or 'bot'.
     * @returns {HTMLElement} The newly created message element.
     */
    const addMessageToChatBox = (text, sender) => {
        const messageElement = document.createElement('div');
        // Use CSS classes for styling instead of a text prefix
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message
        return messageElement;
    };

    /**
     * Converts Gemini's markdown-like response into formatted HTML.
     * This function handles basic formatting like bold text and bulleted lists.
     * @param {string} text The raw text response from the Gemini API.
     * @returns {string} An HTML-formatted string.
     */
    const formatGeminiResponse = (text) => {
        // Process bolding first: **text** -> <strong>text</strong>
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Process bullet points: lines starting with *
        const lines = html.split('\n');
        let inList = false;
        const formattedLines = lines.map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('* ')) {
                const content = trimmedLine.substring(2);
                if (!inList) {
                    inList = true;
                    // Start of a new list
                    return `<ul><li>${content}</li>`;
                }
                // Continues a list
                return `<li>${content}</li>`;
            } else {
                if (inList) {
                    inList = false;
                    // End of a list
                    return `</ul>${line}`;
                }
                return line;
            }
        });

        if (inList) formattedLines.push('</ul>'); // Close list if it's the last element

        // Join lines and replace newlines with <br> for proper paragraph breaks.
        return formattedLines.join('\n').replace(/\n/g, '<br>')
            .replace(/<\/ul><br>/g, '</ul>')
            .replace(/<br><ul>/g, '<ul>')
            .replace(/<\/li><br><li>/g, '</li><li>');
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userMessage = userInput.value.trim();
        if (!userMessage) {
            return; // Don't send empty messages
        }

        // 1. Add the user's message to the chat box
        addMessageToChatBox(userMessage, 'user');
        userInput.value = ''; // Clear the input field

        // 2. Show a temporary "Thinking..." bot message
        const thinkingMessageElement = addMessageToChatBox('Thinking...', 'bot');

        try {
            // 3. Send the user's message to the backend API
            const response = await fetch(`${apiBaseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: userMessage }],
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();

            // 4. Replace "Thinking..." with the AI's reply
            if (data && data.result) {
                thinkingMessageElement.innerHTML = formatGeminiResponse(data.result);
            } else {
                // 5. Handle case where result is missing from response
                thinkingMessageElement.textContent = 'Sorry, no response received.';
            }
        } catch (error) {
            console.error('Error fetching AI response:', error);
            // 5. Handle fetch or other errors
            thinkingMessageElement.textContent = 'Failed to get response from server.';
        }
    });
});