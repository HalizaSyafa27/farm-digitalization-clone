'use client';

import React from 'react';
import styles from '@/components/ui/ViewMore/ViewMore.module.css';
import { Underline } from 'lucide-react';

interface ViewMoreProps {
  onClick?: () => void;
}

const ViewMore: React.FC<ViewMoreProps> = ({ onClick }) => {
  return (
    <div>
      <button className={styles.button} onClick={onClick}>
        Selengkapnya<span className={styles.arrow}>&gt;</span>
      </button>
   
    </div>
  );
};

export default ViewMore;
