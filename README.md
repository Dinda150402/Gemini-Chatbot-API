# AI-Powered Chatbot Backend

A real-time Node.js backend service that manages the full request–response cycle for a browser-based AI chatbot — handling user input, server-side validation, AI communication, and structured response delivery.

Built as part of the **Hacktiv8 AI Productivity and AI API Integration for Developers** program (August 2025).

---

## What It Does

- Receives user messages from a **browser-based interface** via HTTP
- Validates and processes requests **server-side** before forwarding to AI
- Returns AI-generated responses with consistent formatting and structured error handling

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Communication | HTTP-based client–server |
| Core Logic | Request validation, error handling, response pipeline |

---

## Key Features

- **Server-side request validation** — ensures only well-formed requests reach the AI layer
- **Structured error handling** — graceful responses for failed or unexpected inputs
- **Response pipeline design** — ensures reliable AI output delivery under varied input conditions
- **HTTP-based browser integration** — connects directly to a browser frontend without additional dependencies

---

## What I Learned

- How to design a reliable request–response pipeline for real-time AI interactions
- Practical server-side validation patterns that protect downstream API calls
- Error handling strategies that keep the user experience consistent even when things go wrong
- The importance of separating input processing, AI communication, and response formatting as distinct concerns

---

## Author

**Cahayani Dinda Permatasari**  
Backend-focused Software Engineer · Salatiga, Indonesia  
[GitHub](https://github.com/Dinda150402) · [Email](mailto:cahayanidindapermatasari@gmail.com)
