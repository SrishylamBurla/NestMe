"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/admin/users").then(r => r.json()).then(d => setUsers(d.users));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">All Users</h1>
      {users.map(u => (
        <div key={u._id} className="bg-white p-3 rounded mb-2">
          {u.name} ({u.role})
        </div>
      ))}
    </div>
  );
}
