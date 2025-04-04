import React from "react";
import CampaignCard from "./CampaignCard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TnCs from "./TnCs";
import PrivacyPage from "./PrivacyPage";
import RefundPage from "./RefundPage";
import { useState, useEffect } from "react";
import NGOSubmissionForm from "./NGOSubmissionForm";
import AdminPanel from "./AdminPanel";
import AuthForm from "./AuthForm";
import { db, auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function App() {
  const [view, setView] = useState("public");
  const [campaigns, setCampaigns] = useState([]);
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState(null);

  const campaign = campaigns[index];

  useEffect(() => {
    const fetchCampaigns = async () => {
      const q = query(collection(db, "campaigns"), where("approved", "==", true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCampaigns(data);
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const shareCampaign = (platform, campaign) => {
    const shareURL = `https://www.shycares.org/?id=${campaign.id}`;
    const text = `Support this cause on ShyCares: ${campaign.title}`;
    let url = "";
    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(text + " " + shareURL)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareURL)}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank");
  };

  // 🔐 Admin View
  if (view === "admin") {
    return (
      <div>
        <button onClick={() => setView("public")} className="text-blue-600 underline m-4">
          ← Back to Public
        </button>
        <AdminPanel />
      </div>
    );
  }

  // 🐾 NGO Submission View
  if (view === "ngo") {
    if (!user) return <AuthForm onLogin={setUser} />;
    return (
      <div>
        <div className="flex justify-between items-center px-4 mt-4">
          <button onClick={() => setView("public")} className="text-blue-600 underline">
            ← Back to Campaigns
          </button>
          <button onClick={() => signOut(auth)} className="text-red-600 underline text-sm">
            Logout
          </button>
        </div>
        <NGOSubmissionForm />
      </div>
    );
  }

  // ⏳ No campaigns loaded yet
  if (!campaign) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No campaigns to show yet.</p>
      </div>
    );
  }

  // 👤 Public Donor View
  return (
    <Router>
      <Routes>
        <Route path="/terms" element={<TnCs />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />
  
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#f0f3ec] flex flex-col justify-between">
              <div className="flex-1 flex items-center justify-center px-4 py-6">
                <div className="w-full max-w-md">
                  <CampaignCard campaign={campaign} />
                </div>
              </div>
  
              <div className="flex flex-col items-center pb-6 space-y-2">
                <button
                  className="text-indigo-600 text-sm underline"
                  onClick={() => setIndex((prev) => (prev + 1) % campaigns.length)}
                >
                  → See Next Campaign
                </button>
  
                <button
                  className="text-sm text-gray-700 underline"
                  onClick={() => setView("ngo")}
                >
                  🐾 Submit a Campaign
                </button>
  
                <button
                  className="text-sm text-red-500 underline"
                  onClick={() => setView("admin")}
                >
                  🔐 Admin Panel
                </button>
  
                {/* Footer */}
                <div className="pt-4 text-xs text-center text-gray-500 space-x-4">
                  <a href="/terms" className="underline">Terms</a>
                  <a href="/privacy" className="underline">Privacy</a>
                  <a href="/refund" className="underline">Refunds</a>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );  
}
export default App;