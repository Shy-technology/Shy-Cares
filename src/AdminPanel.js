import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

function AdminPanel() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchPendingCampaigns = async () => {
      const q = query(collection(db, "campaigns"), where("approved", "==", false));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCampaigns(data);
    };
    fetchPendingCampaigns();
  }, []);

  const approveCampaign = async (id) => {
    const campaignRef = doc(db, "campaigns", id);
    await updateDoc(campaignRef, { approved: true });
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Campaigns</h1>
      {campaigns.length === 0 && <p>No pending campaigns.</p>}
      <div className="space-y-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white shadow-md rounded-xl p-4">
            <img
              src={campaign.imageURL}
              alt={campaign.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="mt-4 space-y-1">
              <h2 className="text-xl font-bold">{campaign.title}</h2>
              <p className="text-gray-700 text-sm">{campaign.description}</p>
              <p className="text-sm font-semibold text-indigo-600">Target: ₹{campaign.target}</p>
              <p className="text-sm text-gray-600">Location: {campaign.location}</p>
            </div>

            {/* Fund Usage Breakdown */}
            <div className="mt-3">
              <h3 className="font-semibold text-sm mb-1">Fund Usage:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {campaign.fundUsage &&
                  Object.entries(campaign.fundUsage).map(([key, value]) => (
                    <li key={key}>
                      {key}: ₹{value}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Extra Images */}
            {campaign.additionalImages && campaign.additionalImages.length > 0 && (
              <div className="mt-3">
                <h3 className="font-semibold text-sm mb-1">More Images:</h3>
                <div className="flex space-x-2 overflow-x-auto">
                  {campaign.additionalImages.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Additional ${idx + 1}`}
                      className="h-24 rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => approveCampaign(campaign.id)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              ✅ Approve Campaign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;