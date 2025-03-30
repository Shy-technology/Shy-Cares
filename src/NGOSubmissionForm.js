import { db, storage } from "./firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
export default function NGOSubmissionForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    target: "",
    image: null,
    aadhar: null,
    pan: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Upload files to Storage
      const imageRef = ref(storage, `campaigns/images/${formData.image.name}`);
      const aadharRef = ref(storage, `campaigns/kyc/aadhar/${formData.aadhar.name}`);
      const panRef = ref(storage, `campaigns/kyc/pan/${formData.pan.name}`);
  
      const [imageSnap, aadharSnap, panSnap] = await Promise.all([
        uploadBytes(imageRef, formData.image),
        uploadBytes(aadharRef, formData.aadhar),
        uploadBytes(panRef, formData.pan),
      ]);
  
      // 2. Get download URLs
      const [imageURL, aadharURL, panURL] = await Promise.all([
        getDownloadURL(imageSnap.ref),
        getDownloadURL(aadharSnap.ref),
        getDownloadURL(panSnap.ref),
      ]);
  
      // 3. Save campaign data to Firestore
      await addDoc(collection(db, "campaigns"), {
        name: formData.name,
        email: formData.email,
        title: formData.title,
        description: formData.description,
        target: formData.target,
        imageURL,
        aadharURL,
        panURL,
        approved: false,
        submittedAt: Timestamp.now(),
      });
  
      alert("✅ Campaign submitted successfully!");
    } catch (error) {
      console.error("Error submitting campaign:", error);
      alert("❌ Failed to submit campaign. Please try again.");
    }
  };
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Submit a Campaign</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name / NGO Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Campaign Title"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Describe the cause..."
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="target"
          placeholder="Target Amount (INR)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="block">
          Upload Campaign Image:
          <input type="file" name="image" onChange={handleChange} className="mt-1" required />
        </label>
        <label className="block">
          Upload Aadhaar (PDF/Image):
          <input type="file" name="aadhar" onChange={handleChange} className="mt-1" required />
        </label>
        <label className="block">
          Upload PAN Card (PDF/Image):
          <input type="file" name="pan" onChange={handleChange} className="mt-1" required />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Campaign
        </button>
      </form>
    </div>
  );
}