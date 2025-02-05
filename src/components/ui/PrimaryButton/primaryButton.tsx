import React from 'react';
import styles from '@/components/ui/PrimaryButton/PrimaryButton.module.css';

interface PrimaryButtonProps {
  onClick?: () => void;
  label?: string;
  width?: number;
  disabled?: boolean; // Add disabled prop to interface
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, label = "Ubah Data", width = 100, disabled = false }) => {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ''}`} // Apply disabled styles conditionally
      onClick={onClick}
      style={{ width: `${width}px` }}
      disabled={disabled} // Only apply the disabled attribute here
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
