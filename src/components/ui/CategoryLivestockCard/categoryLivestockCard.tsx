'use client';

import React from 'react';
import styles from './CategoryLivestockCard.module.css';
import Link from 'next/link';
import { useRouter } from "next/navigation";

interface CategoryLivestockCardProps {
  icon: React.ReactNode; 
  title: string; 
  total: number; 
  maleCount: number;
  femaleCount: number; 
  href: string;
}


const CategoryLivestockCard: React.FC<CategoryLivestockCardProps> = ({
  icon,
  title,
  total,
  maleCount,
  femaleCount,
  href,
}) => {

  const router = useRouter();

  const handleClick = () => {
    router.push(href); // Arahkan ke query parameter kategori
  };

  return (
    // <Link href={href}>
      <div onClick={handleClick} className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.icon}>{icon}</div> 
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.arrow}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="36" viewBox="0 0 25 36" fill="none">
          <g clipPath="url(#clip0_1382_882)">
            <path d="M24.9321 17.9897C24.9321 17.4819 24.7289 17.0148 24.3429 16.6493L8.25793 0.889129C7.89234 0.543869 7.44554 0.361084 6.91749 0.361084C5.88172 0.361084 5.06934 1.15315 5.06934 2.20924C5.06934 2.71697 5.27244 3.18409 5.59739 3.52936L20.3827 17.9897L5.59739 32.45C5.27244 32.7953 5.06934 33.242 5.06934 33.7702C5.06934 34.8263 5.88172 35.6182 6.91749 35.6182C7.44554 35.6182 7.89234 35.4354 8.25793 35.07L24.3429 19.3301C24.7289 18.9442 24.9321 18.4974 24.9321 17.9897Z" fill="#248543"/>
          </g>
          <defs>
            <clipPath id="clip0_1382_882">
              <rect width="24.3105" height="35.2775" fill="white" transform="translate(0.621094 0.361206)"/>
            </clipPath>
          </defs>
        </svg>
        </div>
      </div>

      {/* Body */}
      <div className={styles.totalSection}>
        <span className={styles.total}>{total}</span>
        <span className={styles.totalLabel}>Total Ekor</span>
      </div>

      {/* Footer */}
      <div className={styles.genderSection}>
        <div className={styles.gender}>
          <span className={styles.genderCount}>{maleCount}</span>
          <span className={styles.genderLabel}>Jantan</span>
        </div>
        <div className={styles.spaceGender}></div>
        <div className={styles.gender}>
          <span className={styles.genderCount}>{femaleCount}</span>
          <span className={styles.genderLabel}>Betina</span>
        </div>
      </div>
    </div>
    // </Link>

  );
};

export default CategoryLivestockCard;