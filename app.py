# app.py
# This script creates a Flask web server (an API) that allows
# a frontend website to use your AI model.

import tensorflow as tf
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS to allow browser requests
import os

# --- 1. INITIALIZE THE FLASK APP & LOAD MODEL ---
app = Flask(__name__)
CORS(app) # This enables Cross-Origin Resource Sharing for your app

MODEL_PATH = 'plantation_verifier_model.h5'
print("Loading the trained AI model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully.")

# --- 2. DEFINE CONSTANTS ---
IMG_HEIGHT = 224
IMG_WIDTH = 224
# The order MUST match the output from your training script
CLASS_NAMES = ['is_plantation', 'not_plantation'] 

# --- 3. DEFINE THE PREDICTION LOGIC ---
# This function takes an image file and returns the model's prediction.
def make_prediction(image_file):
    # Read the image file from the request
    img_stream = image_file.read()
    img_array_np = np.frombuffer(img_stream, np.uint8)
    img = cv2.imdecode(img_array_np, cv2.IMREAD_COLOR)

    # Preprocess the image to match the model's input requirements
    img_resized = cv2.resize(img, (IMG_HEIGHT, IMG_WIDTH))
    img_array_expanded = np.expand_dims(img_resized, axis=0)
    img_preprocessed = tf.keras.applications.mobilenet_v2.preprocess_input(img_array_expanded)

    # Get the raw prediction from the model
    prediction = model.predict(img_preprocessed)
    score = prediction[0][0]

    # Interpret the raw prediction
    if score < 0.5:
        confidence = 1 - score
        predicted_class = CLASS_NAMES[0]  # is_plantation
    else:
        confidence = score
        predicted_class = CLASS_NAMES[1]  # not_plantation
    
    return predicted_class, confidence

# --- 4. CREATE THE API ENDPOINT ---
# This creates the specific URL that the frontend will send images to.
@app.route('/predict', methods=['POST'])
def predict_endpoint():
    # Check if the request contains an image file
    if 'image' not in request.files:
        return jsonify({'error': 'No image file found in request'}), 400

    image_file = request.files['image']
    
    try:
        # Use our function to get the prediction
        predicted_class, confidence = make_prediction(image_file)

        # Create a clean response to send back to the frontend
        response = {
            'prediction': predicted_class,
            'confidence': f"{confidence * 100:.2f}%"
        }
        return jsonify(response)

    except Exception as e:
        # Handle any potential errors
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

# --- 5. START THE SERVER ---
# This code runs when you execute "python app.py" in the terminal.
if __name__ == '__main__':
    # The server will run on localhost, port 5000, as your teammate specified.
    app.run(host='0.0.0.0', port=5000, debug=True)

