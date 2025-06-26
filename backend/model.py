from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

app = FastAPI()

# Allow any requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model and tokenizer
model = AutoModelForSequenceClassification.from_pretrained("KoalaAI/Text-Moderation")
tokenizer = AutoTokenizer.from_pretrained("KoalaAI/Text-Moderation")

class TextInput(BaseModel):
    text: str

# Testing endpoint
@app.get("/")
def read_root():
    return {"message": "API is up and running"}

# Text-Moderation
@app.post("/moderate")
def moderate_text(input: TextInput):
    # Run the model on your input
    inputs = tokenizer(input.text, return_tensors="pt")
    outputs = model(**inputs)
    
    # Get the predicted logits
    logits = outputs.logits

    # Apply softmax to get probabilities (scores)
    # Added .tolist() to convert into a regular list
    probabilities = logits.softmax(dim=-1).squeeze().tolist()

    # Retrieve the labels
    id2label = model.config.id2label
    labels = [id2label[idx] for idx in range(len(probabilities))]

    # Combine labels and probabilities, then sort
    label_prob_pairs = list(zip(labels, probabilities))
    label_prob_pairs.sort(key=lambda item: item[1], reverse=True)  

    # Print the sorted results
    for label, probability in label_prob_pairs:
        print(f"Label: {label} - Probability: {probability:.4f}") 

    return {"results": label_prob_pairs}
