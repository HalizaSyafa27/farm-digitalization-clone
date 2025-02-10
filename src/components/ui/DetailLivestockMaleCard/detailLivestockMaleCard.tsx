'use state'

import React from 'react';
import styles from './DetailLivestockMaleCard.module.css';

interface DetailLivestockFemaleCardProps {
  title: string;
  total: number;
  pedet?: number;
  cempe?: number;
  siapKawin: number;
}

const DetailLivestockFemaleCard: React.FC<DetailLivestockFemaleCardProps> = ({
  title,
  total,
  pedet,
  cempe,
  siapKawin
}) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p  className={styles.total}>
        <span className={styles.totalNumber}>{total}</span>
      </p>
      <p className={styles.ekor}>Ekor</p>

      <div className={styles.details}>
      {cempe !== undefined && ( 
          <p>
            <span className={styles.pedet}>{cempe}</span>
            <br />
            <span>Cempe</span>
          </p>
        )}
      {pedet !== undefined && ( 
          <p>
            <span className={styles.pedet}>{pedet}</span>
            <br />
            <span>Pedet</span>
          </p>
        )}

        <p>
            <span className={styles.siapKawin}>{siapKawin}</span>
            <br/>
            <span>Siap Kawin</span>
        </p>
      </div>
    </div>
  );
};

export default DetailLivestockFemaleCard;
