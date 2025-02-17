'use client'

import React from "react"
import styles from '@/components/ui/DetailLactationCard/DetailLactationCard.module.css'
import ViewMore from "@/components/ui/ViewMore/ViewMore";
import PerbaruiButton from '@/components/ui/PerbaruiButton/PerbaruiButton';
import { Livestock } from '@/models/LivestockModel';
import { useRouter } from 'next/navigation'

interface LactationDetail {
  title: string;
  descriptions: string[];
  livestock?: Livestock;
}

interface DetailLactationCardProps {
  currentLactation?: LactationDetail | null;
  history?: LactationDetail[] | null;
  livestock?: Livestock;
}

const DetailLactationCard: React.FC<DetailLactationCardProps> = ({ currentLactation, history, livestock }) => {
  const router = useRouter();

  const getPageUrl = () => {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    return "/defaultView/[id]/lactation";
  };

  const handleNavigate = () => {
    const pageUrl = getPageUrl();
    const dynamicUrl = pageUrl.replace("[id]", livestock != null ? `${livestock.id}` : "");
    router.push(dynamicUrl);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Laktasi Tahun ini</h3>
        {/* Render title and description only if currentLactation is provided */}
        <div className={styles.title}>
          <h2>{currentLactation?.title ?? "Tidak ada laktasi saat ini"}</h2>
        </div>
        <div>
          {
            currentLactation?.descriptions != null
              ?
              currentLactation?.descriptions.map((description, index) => (
                <p key={index} className={styles.description}>{description}</p>
              ))
              : "Tidak ada deskripsi tersedia"
          }
        </div>
        <div>
          <h3>Riwayat Laktasi</h3>
          {/* Only map through history if it's provided */}
          {history && history.length > 0 ? (
            history.map((item, index) => (
              <div key={index} className={styles.title}>
                <div className={styles.title}>
                  <h2>{item?.title ?? "Tidak ada laktasi saat ini"}</h2>
                </div>
                {
                  item.descriptions.map((description, index) => (
                    <div key={index}>
                      <p className={styles.description}>{description}</p>
                    </div>
                  ))
                }
              </div>
            ))
          ) : (

            <p className={styles.description}>Tidak ada riwayat laktasi yang tersedia.</p>
          )}
        </div>
      </div>


      {/* <div className={styles.header}>
        <h3>Riwayat Laktasi</h3> */}
      {/* Only map through history if it's provided */}
      {/* {history && history.length > 0 ? (
          history.map((item, index) => (
            <div key={index} className={styles.title}>
              <strong>{item.title}</strong>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))
        ) : (

          <p className={styles.description}>Tidak ada riwayat laktasi yang tersedia.</p>
        )}
      </div> */}

      <div>
        <ViewMore onClick={handleNavigate} />
      </div>

      <div className={styles.action}>
        <PerbaruiButton label="Perbarui" onClick={handleNavigate} />
      </div>
    </div>
  );
};

export default DetailLactationCard;
