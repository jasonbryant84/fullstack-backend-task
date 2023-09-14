# Fullstack-Backend Test Task

For information on the front and back ends please see:
- [Backend README](./chatapp/README.md)
- [Frontend README](./chatapp-frontend/README.md)

First start the backend and then the frontend

## Objective
Design and sketch an architecture for a scalable chatbot dialogue management system similar to ChatGPT.

## Requirements

### 1. Architecture Design
- **Session Management:** Users should be able to create and manage multiple chat sessions.
- **Sequential Interaction:** Within each session, interactions should be processed in sequence, maintaining a consistent context.
- **Persistence:** Sessions should be persistent to ensure continuity even after disruptions.
- **In-Memory Contexts:** The chatbot's context should preferably be stored in RAM for faster access.
- **Scalability:** Design the system with scalability in mind, allowing for the accommodation of dozens of thousands (or more) of simultaneous sessions.

### 2. Backend sketch with a dummy bot implementation
- Using **Python** for the backend, create a mock-up or proof-of-concept where the bot simply echoes back the user's input.

### 3. Front-end Sketch
- Develop a simple front-end interface for the chatbot using a framework of your choice.
- Provide a brief justification for your choice of framework.

## Notes
- It's recommended to use best-in-class AI assistants, but this is not mandatory.
- If you believe that a certain requirement is unnecessary or would hinder the system, feel free to omit it. However, provide a detailed reasoning for the exclusion.
- Additional requirements may be introduced based on evolving project needs or insights gained during the task.
