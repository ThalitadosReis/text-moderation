# Text-Moderation (FastAPI + React)

This is a practice project demonstrating a simple content moderation system using **FastAPI** (Python) for the backend and **React** (JavaScript) for the frontend. It leverages the Hugging Face model `KoalaAI/Text-Moderation` to classify and score input text based on moderation categories.

## How It Works

- **FastAPI** provides a RESTful `/moderate` POST endpoint.
- The backend loads a pre-trained Hugging Face model to analyze input text.
- **React** frontend allows users to input text, view classification results, and test API latency.

## Getting Started

### Backend (FastAPI)

#### Requirements

- Python 3.7+
- Dependencies:
  - `fastapi`
  - `uvicorn`
  - `transformers`
  - `torch`
  - `pydantic`

#### Install and Run

    cd backend
    pip install fastapi uvicorn transformers torch
    uvicorn model:app --reload

#### Endpoints
- GET / — Health check
- POST /moderate — Accepts input text and returns moderation scores

### Frontend (React)

#### Requirements
- Node.js
- npm

#### Install and Run

    cd frontend
    npm install
    npm run dev

## Features
- Text classification using a pre-trained Hugging Face model 
- Probabilities returned and sorted by most likely label
- React UI with Tailwind styling
- Latency testing feature (sends 100 POST requests and reports avg/max/min)
- CORS-enabled FastAPI backend