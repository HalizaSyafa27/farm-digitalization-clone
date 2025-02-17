import React, { useEffect, useState } from "react";
import ActivityItem from "./ActivityItem"; // Import komponen ActivityItem
import styles from "./ActivityItem.module.css"; // Import CSS jika diperlukan
import useFetch from "@/hooks/useFetch";

interface ActivityChange {
  what: string;
  from?: string;
  to?: string;
}

interface Activity {
    userName: string;
    date: string;
    description: string;
  //   changes?: ActivityChange[];
  color: string; // Add color for the status indicator (green/gray)
  details?: string[];
}

interface ActivityListProps {
  farmId: number;
}

const ActivityList: React.FC<ActivityListProps> = ({ farmId }) => {
   
  const { data: logActivities, loading: loadingLogActivities, error: errorLogActivities } = useFetch<Activity[]>(
        `${process.env.NEXT_PUBLIC_API_HOST}/activities/farms/${farmId}`,
    );
    // useEffect(() => {
    //     if (livestock?.lactation) {
    //         console.log("generateLactation")
    //         const { currentLactation, lactationHistory } = generateLactationData(livestock);
    //         setCurrentLactation(currentLactation);
    //         setHistory(lactationHistory);
    //     }
    // }, [livestock]);


  return (
    <div className={styles.activityList}>
{ logActivities != null && logActivities.map((activity, idx) => (
        <ActivityItem key={idx} activity={activity} isFirst={idx==0} />
      ))}
    </div>
  );
};

export default ActivityList;
