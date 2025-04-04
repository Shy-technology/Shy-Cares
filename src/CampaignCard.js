import React from "react";
import { useNavigate } from "react-router-dom";

function CampaignCard({ campaign }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/campaign/${campaign.id}`)}
      className="cursor-pointer bg-white rounded-2xl shadow-xl overflow-hidden transition hover:shadow-2xl max-w-md w-full"
    >
      {/* Campaign Image */}
      <img
        src={campaign.imageURL}
        alt={campaign.title}
        className="w-full h-64 object-cover"
      />

      {/* Content */}
      <div className="p-4 space-y-3">
        <h2 className="text-2xl font-bold text-[#040404]">{campaign.title}</h2>
        <p className="text-sm text-gray-700 line-clamp-3">
          {campaign.description}
        </p>

        {/* Details Row */}
        <div className="flex justify-between text-sm mt-2 text-[#691a47]">
          <span>🎯 Target: ₹{campaign.target}</span>
          <span>📍{campaign.location || "India"}</span>
        </div>

        {/* Donate CTA */}
        <button className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
          ❤️ Donate Now
        </button>
      </div>
    </div>
  );
}

export default CampaignCard;
