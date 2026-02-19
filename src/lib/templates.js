export const leadEmailTemplate = ({
  property,
  lead,
  receiverType = "agent", // "agent" | "owner"
}) => {
  const dashboardLink =
    receiverType === "agent"
      ? `${process.env.CLIENT_URL}/agents/${property.agent._id}/leads`
      : `${process.env.CLIENT_URL}/my-leads`;

  const propertyLink = `${process.env.CLIENT_URL}/properties/${property._id}`;

  return `
  <div style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" 
                 style="background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            
            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899); padding:25px; text-align:center; color:white;">
                <h2 style="margin:0;">New Lead Received 🚀</h2>
                <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">
                  Someone is interested in your property
                </p>
              </td>
            </tr>

            <div style="margin-top:10px;">
  <span style="
    display:inline-block;
    padding:6px 12px;
    background:#e0f2fe;
    color:#0369a1;
    border-radius:20px;
    font-size:12px;
    font-weight:bold;
    margin-bottom: 6px;
  ">
    ✓ Verified Platform
  </span>
</div>


            <!-- PROPERTY IMAGE -->
            ${
              property.images?.[0]?.url
  ? `
              <tr>
                <td>
                  <img src="${property.images[0]?.url}" 
                       width="100%" 
                       style="display:block; object-fit:cover; height:260px;" />
                </td>
              </tr>`
                : ""
            }

            <!-- BODY -->
            <tr>
              <td style="padding:30px;">
                
                <h3 style="margin:0 0 10px; color:#111827;">
                  ${property.title}
                </h3>

                <p style="margin:0 0 15px; color:#6b7280; font-size:14px;">
                  ${property.city || ""}
                </p>

                <p style="font-size:20px; font-weight:bold; color:#4f46e5; margin:0 0 20px;">
                  ₹ ${property.priceLabel}
                </p>

                <img src="${process.env.CLIENT_URL}/api/email/track?email=${lead.user?.email}" width="1" height="1" />


                <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />

                <h4 style="margin:0 0 10px;">Lead Details</h4>

                <p style="margin:5px 0;"><strong>Name:</strong> ${lead.user?.name}</p>
                <p style="margin:5px 0;"><strong>Email:</strong> ${lead.user?.email}</p>

                ${
                  lead.phone
                    ? `<p style="margin:5px 0;"><strong>Phone:</strong> ${lead.phone}</p>`
                    : ""
                }

                <div style="margin-top:15px; padding:15px; background:#f9fafb; border-radius:8px; font-size:14px; color:#374151;">
                  ${lead.message}
                </div>

                <!-- BUTTONS -->
                <div style="margin-top:25px; text-align:center;">
                  
                  <a href="${dashboardLink}"
                     style="display:inline-block; padding:12px 24px; 
                            background:#4f46e5; color:#ffffff; 
                            text-decoration:none; border-radius:8px; 
                            font-weight:bold; margin-right:10px;">
                    View Lead
                  </a>

                  <a href="${propertyLink}"
                     style="display:inline-block; padding:12px 24px; 
                            background:#111827; color:#ffffff; 
                            text-decoration:none; border-radius:8px; 
                            font-weight:bold;">
                    View Property
                  </a>

                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
                © ${new Date().getFullYear()} NestMe  
                <br/>
                Verified Listings • Secure Platform • Direct Connect
                <a href="${process.env.CLIENT_URL}/api/email/unsubscribe?email=${lead.user?.email}"
   style="color:#6b7280; text-decoration:underline;">
   Unsubscribe from emails
</a>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `;
};
