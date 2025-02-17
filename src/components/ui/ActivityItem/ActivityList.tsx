import React, { useEffect, useState } from "react";
import ActivityItem from "./ActivityItem"; // Import komponen ActivityItem
import styles from "./ActivityItem.module.css"; // Import CSS jika diperlukan

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

interface ActivityListProps {
  farmId: number;
}

const ActivityList: React.FC<ActivityListProps> = ({ farmId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/activities/farms/${farmId}`);
        const data = await response.json();

        if (data.success) {
          setActivities(data.data);
        } else {
          setError("Gagal mengambil data aktivitas");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [farmId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.activityList}>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

export default ActivityList;
