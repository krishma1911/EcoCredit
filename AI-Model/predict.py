# predict.py
# This script loads the trained model and makes a prediction on a new image.

import tensorflow as tf
import numpy as np
import cv2 # OpenCV library for image processing
import os

# --- 1. SETUP PARAMETERS ---
MODEL_PATH = 'plantation_verifier_model.h5'
IMAGE_TO_TEST = 'test_image.jpg' # The image we want to classify
IMG_HEIGHT = 224
IMG_WIDTH = 224
CLASS_NAMES = ['is_plantation', 'not_plantation'] # Make sure this order matches the training output

# --- 2. CHECK FOR FILES ---
if not os.path.exists(MODEL_PATH):
    print(f"Error: Model file not found at '{MODEL_PATH}'")
    exit()
if not os.path.exists(IMAGE_TO_TEST):
    print(f"Error: Test image not found at '{IMAGE_TO_TEST}'")
    exit()

# --- 3. LOAD THE TRAINED MODEL ---
print("Loading trained model...")
model = tf.keras.models.load_model(MODEL_PATH)

# --- 4. PREPROCESS THE TEST IMAGE ---
# The model expects images in a specific format. We must match that format.
print(f"Loading and preprocessing '{IMAGE_TO_TEST}'...")
# Load the image using OpenCV
img = cv2.imread(IMAGE_TO_TEST)
# Resize the image to the required 224x224 dimensions
img_resized = cv2.resize(img, (IMG_HEIGHT, IMG_WIDTH))
# Expand dimensions to create a "batch" of 1 image
img_array = np.expand_dims(img_resized, axis=0) 
img_preprocessed = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
# --- 5. MAKE A PREDICTION ---
print("Classifying the image...")
prediction = model.predict(img_preprocessed)
score = prediction[0][0] # The prediction score is a value between 0 and 1

# --- 6. DISPLAY THE RESULT ---
# We use a threshold of 0.5. If the score is > 0.5, it's likely class 0, otherwise class 1.
# IMPORTANT: Check your training output to see if 'is_plantation' was class 0 or 1.
# Based on your previous runs, 'is_plantation' is likely class 0.
if score < 0.5:
    # A low score close to 0 corresponds to the first class ('is_plantation')
    confidence = 1 - score
    predicted_class = CLASS_NAMES[0] # is_plantation
else:
    # A high score close to 1 corresponds to the second class ('not_plantation')
    confidence = score
    predicted_class = CLASS_NAMES[1] # not_plantation

print("\n--- Prediction Result ---")
print(f"The model predicts this image is: '{predicted_class}'")
print(f"Confidence: {confidence * 100:.2f}%")