import React, { useState } from "react";
import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function NGOSubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    fundBreakdown: {
      food: "",
      medicines: "",
      surgery: "",
      hospital: "",
      supplements: "",
    },
    imageFiles: [],
    videoFile: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.fundBreakdown) {
      setFormData((prev) => ({
        ...prev,
        fundBreakdown: {
          ...prev.fundBreakdown,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: Array.from(e.target.files),
    }));
  };

  const handleVideoChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      videoFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload images
      const imageURLs = await Promise.all(
        formData.imageFiles.map(async (file) => {
          const imageRef = ref(storage, `campaign-images/${uuidv4()}`);
          await uploadBytes(imageRef, file);
          return await getDownloadURL(imageRef);
        })
      );

      // Upload video
      let videoURL = "";
      if (formData.videoFile) {
        const videoRef = ref(storage, `campaign-videos/${uuidv4()}`);
        await uploadBytes(videoRef, formData.videoFile);
        videoURL = await getDownloadURL(videoRef);
      }

      // Create campaign doc
      await addDoc(collection(db, "campaigns"), {
        title: formData.title,
        description: formData.description,
        target: formData.target,
        fundBreakdown: formData.fundBreakdown,
        imageURLs: imageURLs,
        videoURL: videoURL,
        approved: false,
        createdAt: serverTimestamp(),
        updates: [],
      });

      alert("Campaign submitted! Awaiting admin approval.");
      setFormData({
        title: "",
        description: "",
        target: "",
        fundBreakdown: {
          food: "",
          medicines: "",
          surgery: "",
          hospital: "",
          supplements: "",
        },
        imageFiles: [],
        videoFile: null,
      });
    } catch (err) {
      console.error("Error submitting campaign:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f3ec] px-4 py-6">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center text-[#040404]">🐾 Submit Your Campaign</h2>

        <input
          type="text"
          name="title"
          placeholder="Campaign Title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full p-3 rounded-xl border border-gray-300"
        />

        <textarea
          name="description"
          placeholder="Describe the animal's story and situation..."
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          required
          className="w-full p-3 rounded-xl border border-gray-300"
        />

        <input
          type="number"
          name="target"
          placeholder="Amount Needed (₹)"
          value={formData.target}
          onChange={handleInputChange}
          required
          className="w-full p-3 rounded-xl border border-gray-300"
        />

        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3 border border-gray-200">
          <h3 className="font-semibold text-[#691a47]">💸 Fund Usage Breakdown</h3>
          {Object.keys(formData.fundBreakdown).map((key) => (
            <input
              key={key}
              type="number"
              name={key}
              placeholder={`₹ for ${key.charAt(0).toUpperCase() + key.slice(1)}`}
              value={formData.fundBreakdown[key]}
              onChange={handleInputChange}
              className="w-full p-2 rounded border border-gray-300 text-sm"
            />
          ))}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Upload Photos (up to 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Upload a Video (optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#691a47] text-white py-3 rounded-xl font-semibold hover:bg-[#57123a] transition"
        >
          {submitting ? "Submitting..." : "Submit Campaign"}
        </button>
      </form>
    </div>
  );
}

export default NGOSubmissionForm;
