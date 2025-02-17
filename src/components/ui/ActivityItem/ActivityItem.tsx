import React from "react";

interface ActivityChange {
  what: string;
  from?: string;
  to?: string;
}

interface Activity {
  id: number;
  title: string;
  user: string;
  timestamp: string;
  changes?: ActivityChange[];
}

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <p><strong>{activity.title}</strong></p>
      <p>{activity.user} - {new Date(activity.timestamp).toLocaleString()}</p>
      {activity.changes && activity.changes.length > 0 && (
        <ul>
          {activity.changes.map((change, index) => (
            <li key={index}>
              {change.what}: {change.from} → {change.to}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityItem;
