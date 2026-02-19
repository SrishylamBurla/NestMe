export const propertyUnderReviewTemplate = ({
  userName,
  propertyTitle,
}) => {
  return `
  <div style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" 
            style="background:#ffffff;border-radius:14px;overflow:hidden;
                   box-shadow:0 10px 30px rgba(0,0,0,0.05);">

            <!-- HEADER -->
            <tr>
              <td style="background:linear-gradient(135deg,#4f46e5,#9333ea);
                         padding:30px;text-align:center;color:white;">
                <h1 style="margin:0;font-size:22px;">
                  Property Submitted Successfully 🎉
                </h1>
                <p style="margin-top:8px;font-size:14px;opacity:0.9;">
                  Your listing is now under review
                </p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:30px 35px;color:#374151;font-size:14px;line-height:1.6;">

                <p>Hi <strong>${userName}</strong>,</p>

                <p>
                  Thank you for submitting your property:
                </p>

                <div style="background:#eef2ff;
                            padding:15px;
                            border-radius:8px;
                            margin:15px 0;">
                  <strong style="font-size:15px;">
                    ${propertyTitle}
                  </strong>
                </div>

                <p>
                  Our admin team is currently reviewing your listing.
                  This usually takes less than 24 hours.
                </p>

                <div style="margin:20px 0;text-align:center;">
                  <span style="display:inline-block;
                               background:#fef3c7;
                               color:#92400e;
                               padding:8px 18px;
                               border-radius:50px;
                               font-weight:bold;
                               font-size:13px;">
                    ⏳ Status: Under Review
                  </span>
                </div>

                <div style="text-align:center;margin-top:25px;">
                  <a href="${process.env.CLIENT_URL}/my-properties"
                     style="display:inline-block;
                            padding:12px 24px;
                            background:#4f46e5;
                            color:white;
                            text-decoration:none;
                            border-radius:8px;
                            font-weight:600;">
                    View My Properties
                  </a>
                </div>

                <p style="margin-top:30px;">
                  — Team NestMe 🏡
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#f9fafb;
                         padding:20px;
                         text-align:center;
                         font-size:12px;
                         color:#6b7280;">
                © ${new Date().getFullYear()} NestMe. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `;
};
