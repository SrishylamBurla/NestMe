
// "use client";

// import { useRouter } from "next/navigation";

// function Row({ icon, title, link, danger }) {
//   const router = useRouter();

//   return (
//     <button
//       onClick={() => router.push(link)}
//       className={`w-full flex items-center justify-between p-4 transition
//         ${danger ? "hover:bg-red-900/30" : "hover:bg-slate-700"}
//       `}
//     >
//       <div className="flex items-center gap-4">
//         <div
//           className={`h-10 w-10 rounded-full flex items-center justify-center
//             ${
//               danger
//                 ? "bg-red-900/40 text-red-400"
//                 : "bg-slate-700 text-indigo-400"
//             }
//           `}
//         >
//           <span className="material-symbols-outlined">{icon}</span>
//         </div>

//         <p
//           className={`text-sm font-medium ${
//             danger ? "text-red-400" : "text-white"
//           }`}
//         >
//           {title}
//         </p>
//       </div>

//       <span className="material-symbols-outlined text-slate-500">
//         chevron_right
//       </span>
//     </button>
//   );
// }

// function Section({ title, children }) {
//   return (
//     <div className="space-y-2">
//       <p className="text-xs text-slate-400 px-2 uppercase tracking-wide">
//         {title}
//       </p>

//       <div className="bg-slate-800 rounded-2xl border border-white/5 overflow-hidden">
//         {children}
//       </div>
//     </div>
//   );
// }

// export default function ProfileSection({ user }) {
//   const isAgent = user?.role === "agent";
//   const isAdmin = user?.role === "admin";

//   return (
//     <div className="px-4 space-y-6">
//       {/* ================= ACCOUNT ================= */}
//       <Section title="Account">
//         <Row icon="person" title="Personal Information" link="/me/edit" />
//         {/* <Row icon="lock" title="Change Password" link="/me/change-password" /> */}
//         <Row icon="favorite" title="Saved Properties" link="/saved" />

//         <Row icon="mail" title="My Enquiries" link="/my-enquiries" />
//       </Section>

//       {/* ================= AGENT TOOLS ================= */}
//       {isAgent && (
//         <Section title="Agent Tools">
//           <Row
//             icon="dashboard"
//             title="Agent Dashboard"
//             link={`/agents/${user?.agentProfileId}/dashboard`}
//           />

//           {!isAgent && (
//             <Row icon="mail" title="My Enquiries" link="/my-enquiries" />
//           )}

//           {isAgent && (
//             <Row
//               icon="mail"
//               title="My Enquiries"
//               link={`/agents/${user?.agentProfileId}/enquiries`}
//             />
//           )}

//           {/* <Row
//             icon="home"
//             title="My Listings"
//             link={`/agents/${user?.agentProfileId}/properties`}
//           />
//           <Row
//             icon="groups"
//             title="Leads"
//             link={`/agents/${user?.agentProfileId}/leads`}
//           /> */}
//           <Row icon="payments" title="Subscription Plan" link="/subscribe" />
//         </Section>
//       )}

//       {/* ================= ADMIN ================= */}
//       {isAdmin && (
//         <Section title="Admin">
//           <Row
//             icon="admin_panel_settings"
//             title="Admin Dashboard"
//             link="/admin/dashboard"
//           />
//         </Section>
//       )}

//       {/* ================= PREFERENCES ================= */}
//       {/* <Section title="Preferences">
//         <Row icon="notifications" title="Notifications" link="/notifications" />
//         <Row icon="settings" title="App Settings" link="/settings" />
//       </Section> */}

//       {/* ================= SUPPORT ================= */}
//       <Section title="Support">
//         <Row icon="help" title="Help Center" link="/help" />
//         <Row icon="description" title="Terms & Privacy" link="/terms" />
//       </Section>

//       {/* ================= DANGER ZONE ================= */}
//       <Section title="Danger Zone">
//         <Row icon="delete" title="Delete Account" link="/me/delete" danger />
//       </Section>
//     </div>
//   );
// }


"use client";

import { useRouter } from "next/navigation";

function Row({ icon, title, link }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(link)}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-700 transition"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400">
          <span className="material-symbols-outlined">
            {icon}
          </span>
        </div>

        <p className="text-sm font-medium">
          {title}
        </p>
      </div>

      <span className="material-symbols-outlined text-slate-500">
        chevron_right
      </span>
    </button>
  );
}

export default function ProfileSection({ user }) {

  return (
    <div className="px-4 space-y-6">

      {/* ACCOUNT */}
      <Section title="Account">
        <Row icon="person" title="Personal Information" link="/me/edit" />
        <Row icon="lock" title="Change Password" link="/me/edit#password" />
        <Row icon="phone" title="Verify Phone" link="/me/verify-phone" />
      </Section>

      {/* PROPERTY ACTIVITY */}
      <Section title="Property Activity">
        <Row icon="favorite" title="Saved Properties" link="/saved" />
        <Row icon="mail" title="My Enquiries" link="/my-enquiries" />
        <Row icon="history" title="Recently Viewed" link="/recent" />

        {user?.role === "agent" && (
          <>
            <Row icon="home" title="My Listings" link={`/agents/${user.agentProfileId}/properties`} />
            <Row icon="groups" title="Leads Received" link={`/agents/${user.agentProfileId}/leads`} />
          </>
        )}
      </Section>

      {/* AGENT PANEL */}
      {user?.role === "agent" && (
        <Section title="Agent Tools">
          <Row icon="dashboard" title="Agent Dashboard" link={`/agents/${user.agentProfileId}/dashboard`} />
          <Row icon="badge" title="Agent Profile" link={`/agents/${user.agentProfileId}`} />
          <Row icon="credit_card" title="Subscription" link="/subscription" />
        </Section>
      )}

      {/* APP SETTINGS */}
      <Section title="Preferences">
        <Row icon="notifications" title="Notifications" link="/notifications" />
        <Row icon="settings" title="App Settings" link="/settings" />
        <Row icon="privacy_tip" title="Privacy & Terms" link="/terms" />
      </Section>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-slate-800 rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-4 pt-4 text-xs uppercase text-slate-400">
        {title}
      </div>
      {children}
    </div>
  );
}