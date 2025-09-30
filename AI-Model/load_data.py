# load_data.py
import tensorflow as tf
import os

DATA_DIR = 'dataset'
IMG_HEIGHT = 224
IMG_WIDTH = 224
BATCH_SIZE = 32

if not os.path.exists(DATA_DIR):
    print(f"Error: The directory '{DATA_DIR}' was not found.")
    exit()

train_dataset = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE
)

validation_dataset = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(IMG_HEIGHT, IMG_WIDTH),
    batch_size=BATCH_SIZE
)

class_names = train_dataset.class_names
print("\n--- Setup Complete ---")
print(f"Found the following classes: {class_names}")