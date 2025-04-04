import React from "react";
import { FaFacebook, FaWhatsapp, FaTwitter } from "react-icons/fa";

const CampaignDetail = ({ campaign }) => {
  if (!campaign) {
    return <p className="text-center text-gray-500">Loading campaign...</p>;
  }

  const share = (platform) => {
    const url = `https://shycares.org/?id=${campaign.id}`;
    const text = `Support this animal welfare cause: ${campaign.title}`;
    let link = "";

    switch (platform) {
      case "facebook":
        link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        link = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "twitter":
        link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
    }

    window.open(link, "_blank");
  };

  return (
    <div className="bg-[#f0f3ec] min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-y-scroll">

        {/* Image */}
        <img src={campaign.imageURL} alt={campaign.title} className="w-full h-64 object-cover" />

        {/* Title and Short Info */}
        <div className="p-4 space-y-2">
          <h1 className="text-2xl font-bold text-[#040404]">{campaign.title}</h1>
          <p className="text-sm text-gray-600">{campaign.location || "India"}</p>
          <p className="text-indigo-600 font-medium">Target: ₹{campaign.target}</p>

          {/* ❤️ Donate Now */}
          <button className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
            ❤️ Donate Now
          </button>
        </div>

        {/* Story */}
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold mb-1">📖 Story</h2>
          <p className="text-sm text-gray-700">{campaign.story || "No story provided."}</p>
        </div>

        {/* Updates */}
        {campaign.updates && campaign.updates.length > 0 && (
          <div className="px-4 py-2">
            <h2 className="text-lg font-semibold mb-1">📝 Current Updates</h2>
            <ul className="text-sm text-gray-700 list-disc ml-5">
              {campaign.updates.map((update, i) => (
                <li key={i}>{update}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Funds Usage */}
        {campaign.fundUsage && (
          <div className="px-4 py-2">
            <h2 className="text-lg font-semibold mb-1">💰 Funds Usage Summary</h2>
            <ul className="text-sm text-gray-700 list-disc ml-5">
              {Object.entries(campaign.fundUsage).map(([category, amount]) => (
                <li key={category}>{category}: ₹{amount}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Media */}
        {campaign.media && campaign.media.length > 0 && (
          <div className="px-4 py-2">
            <h2 className="text-lg font-semibold mb-1">📸 More Photos / Videos</h2>
            <div className="grid grid-cols-2 gap-2">
              {campaign.media.map((url, i) => (
                <img key={i} src={url} alt={`Media ${i + 1}`} className="w-full h-32 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="px-4 py-4 flex justify-around text-xl text-[#691a47]">
          <button onClick={() => share("facebook")}><FaFacebook /></button>
          <button onClick={() => share("whatsapp")}><FaWhatsapp /></button>
          <button onClick={() => share("twitter")}><FaTwitter /></button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;