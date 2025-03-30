import { useState, useEffect } from "react";
import NGOSubmissionForm from "./NGOSubmissionForm";
import AdminPanel from "./AdminPanel";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [view, setView] = useState("public");
  const [campaigns, setCampaigns] = useState([]);
  const [index, setIndex] = useState(0);

  // ✅ Load approved campaigns from Firestore
  useEffect(() => {
    const fetchCampaigns = async () => {
      const q = query(collection(db, "campaigns"), where("approved", "==", true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCampaigns(data);
    };

    fetchCampaigns();
  }, []);

  const campaign = campaigns[index];

  // 🟢 Admin View
  if (view === "admin") {
    return (
      <div>
        <button
          onClick={() => setView("public")}
          className="text-blue-600 underline m-4"
        >
          ← Back to Public
        </button>
        <AdminPanel />
      </div>
    );
  }

  // 🐾 NGO Submission View
  if (view === "ngo") {
    return (
      <div>
        <button
          onClick={() => setView("public")}
          className="text-blue-600 underline m-4"
        >
          ← Back to Campaigns
        </button>
        <NGOSubmissionForm />
      </div>
    );
  }

  // ⏳ Loading State or No Campaigns
  if (!campaign) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No campaigns to show yet.</p>
      </div>
    );
  }

  // 👤 Public Donor View
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
        <img
          src={campaign.imageURL}
          alt={campaign.title}
          className="w-full h-64 object-cover rounded-t-2xl"
        />
        <div className="p-4 space-y-2">
          <h2 className="text-xl font-bold">🐾{campaign.title}</h2>
          <p className="text-gray-700">{campaign.description}</p>
          <p className="font-semibold text-indigo-600">Target: {campaign.target}</p>
          <button className="w-full mt-4 bg-green-500 text-white py-2 rounded-xl text-lg hover:bg-green-600 transition">
            Donate
          </button>
        </div>
      </div>

      <button
        className="mt-4 text-blue-600 underline"
        onClick={() => setIndex((prev) => (prev + 1) % campaigns.length)}
      >
        → See Next Campaign
      </button>

      <button
        className="mt-2 text-sm text-gray-600 underline"
        onClick={() => setView("ngo")}
      >
        🐾 Submit a Campaign
      </button>

      <button
        className="mt-2 text-sm text-red-500 underline"
        onClick={() => setView("admin")}
      >
        🔐 Admin Panel
      </button>
    </div>
  );
}

export default App;