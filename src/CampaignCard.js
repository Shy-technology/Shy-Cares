import React from "react";
import { useState } from "react";
export default function CampaignCard({ campaign }) {
  const [tab, setTab] = useState("about");

  return (
    <div className="bg-white rounded-2xl shadow-md w-full max-w-md overflow-hidden relative">
      {/* 🖼️ Campaign Image */}
      <div className="relative">
        <img src={campaign.imageURL} alt={campaign.title} className="w-full h-60 object-cover" />
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
          {campaign.category || "Animal Welfare"}
        </span>
      </div>

      {/* 📄 Content Area */}
      <div className="p-4 pb-28"> {/* Push content up to leave space for sticky bar */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">{campaign.title}</h2>

        {/* 🏷️ Tags */}
        <div className="flex flex-wrap gap-2 text-xs mb-3">
          {campaign.tags?.map((tag, i) => (
            <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">
              {tag}
            </span>
          ))}
        </div>

        {/* 🔁 Tabs */}
        <div className="flex space-x-4 border-b mb-3 text-sm">
          {["about", "usage", "updates"].map((t) => (
            <button
              key={t}
              className={`pb-1 ${tab === t ? "border-b-2 border-black font-medium" : "text-gray-500"}`}
              onClick={() => setTab(t)}
            >
              {t === "about" ? "About" : t === "usage" ? "Fund Usage" : "Updates"}
            </button>
          ))}
        </div>

        {/* 📑 Tab Content */}
        <div className="text-sm text-gray-700 leading-relaxed">
          {tab === "about" && <p>{campaign.description}</p>}

          {tab === "usage" && (
            <ul className="list-disc pl-5 space-y-1">
              {(campaign.usage || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {tab === "updates" && (
            <ul className="list-disc pl-5 space-y-1">
              {(campaign.updates || []).map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          )}
        </div>

        {/* 💰 Target */}
        <p className="mt-4 font-semibold text-indigo-600">
          Target: ₹{campaign.target}
        </p>
      </div>

      {/* 🚀 Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 text-sm text-gray-700 z-50 max-w-md mx-auto">
        <button className="flex flex-col items-center text-red-500">❤️<span>Donate</span></button>
        <button className="flex flex-col items-center text-blue-500">🔁<span>Share</span></button>
        <button className="flex flex-col items-center text-yellow-600">📌<span>Save</span></button>
        <button className="flex flex-col items-center text-gray-700">💬<span>Updates</span></button>
      </div>
    </div>
  );
}
