export const propertyStatusEmailTemplate = ({
  userName,
  property,
  approvalStatus,
  rejectionReason,
}) => {

  const isApproved = approvalStatus === "approved";
  const isRejected = approvalStatus === "rejected";
  const isPending = approvalStatus === "pending";

  let primaryColor = "#10b981"; // green default
  let bgSoft = "#ecfdf5";
  let heading = "🎉 Your Property is Live!";
  let subMessage = "Your property is now visible to buyers and agents.";
  let ctaText = "View Live Property";
  let ctaLink = `${process.env.CLIENT_URL}/properties/${property._id}`;

  if (isRejected) {
    primaryColor = "#ef4444";
    bgSoft = "#fef2f2";
    heading = "❌ Property Requires Updates";
    subMessage =
      rejectionReason || "Please review and update your listing.";
    ctaText = "Edit & Resubmit";
    ctaLink = `${process.env.CLIENT_URL}/my-properties/edit/${property._id}`;
  }

  if (isPending) {
    primaryColor = "#f59e0b";
    bgSoft = "#fffbeb";
    heading = "⏳ Property Back Under Review";
    subMessage =
      "Your property is currently under review again by our admin team.";
    ctaText = "View My Properties";
    ctaLink = `${process.env.CLIENT_URL}/my-properties`;
  }

  return `
  <div style="font-family: Arial, sans-serif; background:#f3f4f6; padding:40px 20px;">
    <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:14px; box-shadow:0 8px 20px rgba(0,0,0,0.05);">

      <!-- BRAND HEADER -->
      <div style="text-align:center; margin-bottom:25px;">
        <h1 style="margin:0; color:#111827;">NestMe</h1>
        <p style="font-size:13px; color:#6b7280; margin-top:4px;">
          India’s Smart Property Marketplace
        </p>
      </div>

      <!-- STATUS HEADER -->
      <h2 style="color:${primaryColor}; margin-bottom:10px;">
        ${heading}
      </h2>

      <p style="color:#374151;">
        Hi <strong>${userName}</strong>,
      </p>

      <p style="color:#374151;">
        Your property <strong>${property.title}</strong> has been 
        <strong>${approvalStatus}</strong>.
      </p>

      <!-- PROPERTY SUMMARY -->
      <div style="background:#f9fafb; padding:15px; border-radius:10px; margin:20px 0;">
        <p style="margin:4px 0;"><strong>Type:</strong> ${property.propertyType}</p>
        <p style="margin:4px 0;"><strong>Listing:</strong> ${property.listingType}</p>
        <p style="margin:4px 0;"><strong>City:</strong> ${property.city}</p>
        <p style="margin:4px 0;"><strong>Price:</strong> ₹${property.priceLabel}</p>
      </div>

      <!-- STATUS MESSAGE -->
      <div style="background:${bgSoft}; padding:15px; border-radius:10px; margin-bottom:20px;">
        ${subMessage}
      </div>

      <!-- CTA BUTTON -->
      <div style="text-align:center; margin-top:20px;">
        <a href="${ctaLink}"
          style="display:inline-block;
                 padding:14px 22px;
                 background:${primaryColor};
                 color:white;
                 text-decoration:none;
                 border-radius:8px;
                 font-weight:bold;">
          ${ctaText}
        </a>
      </div>

      <!-- SUPPORT -->
      <p style="margin-top:30px; font-size:13px; color:#6b7280;">
        Need help? Contact our support team anytime.
      </p>

      <!-- FOOTER -->
      <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;" />

      <p style="font-size:12px; color:#9ca3af; text-align:center;">
        © ${new Date().getFullYear()} NestMe. All rights reserved.
      </p>

    </div>
  </div>
  `;
};
