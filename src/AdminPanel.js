import React from "react";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";

export default function AdminPanel() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchPendingCampaigns = async () => {
      const q = query(collection(db, "campaigns"), where("approved", "==", false));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCampaigns(data);
    };

    fetchPendingCampaigns();
  }, []);

  const approveCampaign = async (id) => {
    await updateDoc(doc(db, "campaigns", id), { approved: true });
    alert("✅ Campaign approved!");
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pending Campaigns</h2>
      {campaigns.length === 0 ? (
        <p className="text-gray-600">No pending campaigns.</p>
      ) : (
        campaigns.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow p-4 mb-4">
            <img src={c.imageURL} alt={c.title} className="w-full h-48 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{c.title}</h3>
            <p className="text-gray-700">{c.description}</p>
            <button
              onClick={() => approveCampaign(c.id)}
              className="mt-3 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              ✅ Approve
            </button>
          </div>
        ))
      )}
    </div>
  );
}