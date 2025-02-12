import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '@/components/ui/TopBar/TopBar.module.css';
import SearchBar from '../SearchBar/searchBar';
import OwnerProfile from '../OwnerProfile/ownerProfile';
import { notificationListData } from '@/data/notificationData';
import AcceptButton from '../AcceptButton/AcceptButton';
import RejectButton from '../RejectButton/RejectButton';
import { getCookie } from '@/lib/cookies';
import useFetch from '@/hooks/useFetch';
import { FarmRequestModel } from '@/models/FarmRequestModel';


interface TopBarProps {
  onSearch?: (value: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
    const storedId = getCookie("id"); 

    const { data: farmRequestData, loading: loadingFarms, error: errorFarms } = useFetch<FarmRequestModel[]>(
        `${process.env.NEXT_PUBLIC_API_HOST}/farm-requests/pending?operatorId=${storedId}`,
    );

  const [isOpen, setIsOpen] = useState(false);
 const [searchQuery, setSearchQuery] = useState('');

  // Function to close the dropdown when clicking outside
  const closeDropdown = () => setIsOpen(false);

  // Handle click outside dropdown
  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest('#dropdown-container')) {
      closeDropdown();
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined' && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [isOpen]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.searchbar}>
          <SearchBar onSearch={onSearch} />
        </div>

        <div
          className={styles.operatorProfile}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
            <path
              d="M41.2573 32.4978C41.1017 32.3103 40.9488 32.1228 40.7989 31.9419C38.7364 29.4472 37.4885 27.9416 37.4885 20.8794C37.4885 17.2231 36.6138 14.2231 34.8898 11.9731C33.6185 10.3109 31.9001 9.05 29.6351 8.11812C29.606 8.10191 29.5799 8.08064 29.5582 8.05531C28.7435 5.32719 26.5142 3.5 23.9998 3.5C21.4854 3.5 19.257 5.32719 18.4423 8.0525C18.4206 8.07694 18.3949 8.09754 18.3664 8.11344C13.0807 10.2894 10.512 14.4641 10.512 20.8766C10.512 27.9416 9.26604 29.4472 7.20167 31.9391C7.05167 32.12 6.89885 32.3037 6.74323 32.495C6.34123 32.9798 6.08653 33.5696 6.00927 34.1947C5.93202 34.8197 6.03543 35.4538 6.30729 36.0219C6.88573 37.2406 8.11854 37.9972 9.52573 37.9972H38.4842C39.8848 37.9972 41.1092 37.2416 41.6895 36.0284C41.9625 35.4602 42.0669 34.8256 41.9903 34.1998C41.9137 33.5741 41.6593 32.9834 41.2573 32.4978ZM23.9998 45.5C25.3545 45.4989 26.6837 45.1312 27.8463 44.4358C29.009 43.7404 29.9617 42.7433 30.6035 41.5503C30.6338 41.4931 30.6487 41.4291 30.6469 41.3645C30.6451 41.2998 30.6266 41.2367 30.5932 41.1813C30.5598 41.126 30.5126 41.0802 30.4563 41.0484C30.3999 41.0166 30.3363 40.9999 30.2717 41H17.7298C17.665 40.9998 17.6013 41.0163 17.5449 41.048C17.4884 41.0797 17.4411 41.1255 17.4076 41.1809C17.3741 41.2364 17.3555 41.2995 17.3536 41.3642C17.3518 41.429 17.3667 41.4931 17.397 41.5503C18.0387 42.7432 18.9913 43.7402 20.1538 44.4356C21.3163 45.1309 22.6452 45.4987 23.9998 45.5Z"
              fill="#B3B3B3"
            />
          </svg>
        </div>

        {/* <div className={styles.profile}>
          <OwnerProfile src="/OwnerProfile.jpeg" altText=" " />
        </div> */}
      </div>

      {isOpen && typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div id="dropdown-container" className={styles.dropdown}>
            <h1>Notifikasi</h1>
            {/* {notificationListData.map((notification) => (
              <div className={styles.notificationRow}>
                <img src={notification.profile_url} alt="" />
              <p><b>{notification.user_name}</b> {notification.action}</p>
              </div>
            ))} */}
            {notificationListData.slice(1, 3).map((notification, index) => (
              <div key={notification.user_name + notification.action}>
                <div className={styles.notificationRow}>
                  {/* <img src={notification.profile_url} alt="" /> */}
                  <div className={styles.notificationText}>
                    <p><b>{notification.user_name}</b> {notification.action}</p>
                  </div>
                </div>
              </div>
            ))}

          </div>,
          document.body 
        )}
    </>
  );
};

export default TopBar;
