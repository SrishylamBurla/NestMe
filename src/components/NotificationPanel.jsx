import { useMemo } from "react";

export default function NotificationPanel({
  showNotifications,
  setShowNotifications,
  notifications = [],
  markRead,
  markAllRead,
  handleNavigate,
  getIcon,
}) {
  const groupedNotifications = useMemo(() => {
    const groups = { Today: [], Yesterday: [], Earlier: [] };
    const now = new Date();

    notifications.forEach((n) => {
      const date = new Date(n.createdAt);
      const diff = now - date;
      const oneDay = 86400000;

      if (diff < oneDay && now.getDate() === date.getDate())
        groups.Today.push(n);
      else if (diff < 2 * oneDay) groups.Yesterday.push(n);
      else groups.Earlier.push(n);
    });

    return groups;
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      {/* Overlay */}
      {showNotifications && (
        <div
          onClick={() => setShowNotifications(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-all duration-300
        ${showNotifications ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500">
                {unreadCount} unread
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-indigo-600"
              >
                Mark all
              </button>
            )}
            <button onClick={() => setShowNotifications(false)}>
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto h-full">
          {Object.entries(groupedNotifications).map(
            ([group, items]) =>
              items.length > 0 && (
                <div key={group}>
                  <p className="text-xs text-gray-400 mb-2">
                    {group}
                  </p>

                  <div className="space-y-3">
                    {items.map((n) => (
                      <div
                        key={n._id}
                        onClick={async () => {
                          await markRead(n._id);
                          handleNavigate(n.link);
                        }}
                        className={`p-4 rounded-xl cursor-pointer transition
                        ${
                          !n.isRead
                            ? "bg-indigo-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <p className="font-semibold">{n.title}</p>
                        <p className="text-xs text-gray-600">
                          {n.message}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}

          {notifications.length === 0 && (
            <p className="text-center text-gray-400">
              No notifications
            </p>
          )}
        </div>
      </div>
    </>
  );
}