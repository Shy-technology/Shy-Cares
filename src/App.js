import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import CampaignCard from "./CampaignCard";
import CampaignDetail from "./CampaignDetail";
import TnCs from "./TnCs";
import PrivacyPage from "./PrivacyPage";
import RefundPage from "./RefundPage";
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
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  if (!campaign) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No campaigns to show yet.</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/terms" element={<TnCs />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />

        <Route
          path="/campaign/:id"
          element={<CampaignDetail campaigns={campaigns} />}
        />

        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#f0f3ec] flex flex-col items-center justify-between p-4">
              <CampaignCard campaign={campaign} />

              <div className="w-full max-w-md text-center mt-6 space-y-2">
                <button
                  className="text-blue-700 underline"
                  onClick={() => setIndex((prev) => (prev + 1) % campaigns.length)}
                >
                  → See Next Campaign
                </button>

                <div className="flex justify-between text-sm text-gray-600 mt-4 px-6">
                  <button onClick={() => setView("ngo")} className="underline">
                    🐾 Submit a Campaign
                  </button>
                  <button onClick={() => setView("admin")} className="text-red-500 underline">
                    🔐 Admin Panel
                  </button>
                </div>

                <div className="text-xs text-gray-500 space-x-4 mt-6">
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
