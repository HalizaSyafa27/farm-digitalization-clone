'use client'

import { useRouter } from 'next/navigation';
import styles from './TabNavigation.module.css';

const TabNavigation = () => {
  const router = useRouter();

  const tabs = [
    { id: 1, label: "Data Ternak", path: "/defaultView/addTernakPage"},
    { id: 2, label: "Data Detail Ternak", path: "/defaultView/addTernakPage/addDataDetailTernakPage" , active: false  },
  ];

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (

    <div className={styles.tabContainer}>

      <div className={styles.title}>
      <h1>
              Tambah Ternak
      </h1>
      </div>
      

      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => handleTabClick(tab.path)}
          className={`${styles.tabItem} ${tab.active ? styles.activeTab : ""}`}
        >
          <span className={styles.tabIcon}>{tab.id}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
