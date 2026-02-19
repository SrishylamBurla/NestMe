

const { data } = useGetNotificationsQuery();

const unread = data?.filter(n => !n.isRead).length;

return (
  <div className="relative">
    <BellIcon />
    {unread > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 rounded-full">
        {unread}
      </span>
    )}
  </div>
);
