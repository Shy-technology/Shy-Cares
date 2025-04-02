import React from "react";

function RefundPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Cancellation & Refund Policy</h1>
      <p>
        Donations made on ShyCares are voluntary and intended for the welfare of animals. Once a donation is processed,
        it cannot be cancelled or refunded.
      </p>
      <p className="mt-2">
        In case of a technical error or duplicate transaction, donors may contact us at support@shycares.org or via our
        contact form. Refunds, if applicable, will be processed after verification.
      </p>
      <p className="mt-2">
        ShyCares does not guarantee the success of a fundraiser or the use of funds post-campaign.
      </p>
    </div>
  );
}

export default RefundPage;
