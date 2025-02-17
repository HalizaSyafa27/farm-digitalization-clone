import React, { useState } from "react";
import Activity from "./ActivityList";
import MoreCardDelete from "../MoreCardDelete/MoreCardDelete";

interface Activity {
    userName: string;
    date: string;
    description: string;
    color: string; // Status indicator color (green/gray)
    details?: string[];
  }
  
  interface ActivityItemProps {
    activity: Activity;
    isFirst: boolean;
  }
  
  const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isFirst }) => {
    const [isMoreCardDeleteVisible, setIsMoreCardDeleteVisible] = useState(false);
  
    const handleMoreCardDeleteClick = () => {
      setIsMoreCardDeleteVisible((prev) => !prev);
    };
  
    return (
      <div className="activitiesTimelineItem">
        <div className="activitiesTimelineItemInformation">
          {/* Status Indicator */}
          <div className='activitiesTimelineItemInformationIndicator'>
          {isFirst 
          ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#248543"/>
            </svg>
          :
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#B1B1B4"/>
            </svg>
          }
          <div className="divider"></div>
          </div>
          
  
          {/* Activity Content */}
          <div className="activitiesTimelineItemInformationData">
            {/* Time & Date */}
            <div className="activitiesTimelineItemInformationDataTime">
              <h1>
                {new Date(activity.date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).replace(":", ".")}
              </h1>
              <p>
                {new Date(activity.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                })}
              </p>
            </div>
  
            {/* Activity Details */}
            <div className="activitiesTimelineItemInformationDataInformation">
              <div className="activitiesTimelineItemInformationDataInformationMain">
                <h1>{activity.description}</h1>
                <p>{activity.userName || "Unknown User"}</p>
              </div>
  
              {/* Additional Details (if available) */}
              {activity.details?.map((detail, index) => (
                <p key={index}>{detail}</p>
              ))}
            </div>
          </div>
  
          {/* Action Button */}

        </div>
      </div>
    );
  };

export default ActivityItem;
