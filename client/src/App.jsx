import React, { useState } from "react";
import { uploadImage } from "./services/api";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setMessage("Please select an image first!");
      return;
    }

    try {
      const response = await uploadImage(selectedImage);
      setMessage(`Upload successful: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed!");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">EcoCredit</h1>
      </header>
      <main className="main-container">
        <h2 className="subtitle">Get Green EcoCredits for Green Efforts</h2>
        <h3 className="section-title">Upload Carbon Project Image</h3>

        <div className="upload-box">
          <p>
            Upload images of your carbon sequestration projects (forests,
            renewable energy, etc.) for AI verification and tokenization.
          </p>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload Image</button>
        </div>

        {previewUrl && (
          <div className="preview-container">
            <img src={previewUrl} alt="Preview" className="preview" />
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </main>
    </div>
  );
}

export default App;
