import React from 'react';
import styles from '@/components/ui/SecondaryButton/SecondaryButton.module.css';

interface PrimaryButtonProps {
  onClick?: () => void;
  label?: string;
  width?: number;
}

const SecondaryButton: React.FC<PrimaryButtonProps> = ({ onClick, label = "Ubah Data", width = 100}) => {
  return (
    <button className={styles.button} onClick={onClick} style={{ width: `${width}px` }} >
      {label}
    </button>
  );
};

export default SecondaryButton;
