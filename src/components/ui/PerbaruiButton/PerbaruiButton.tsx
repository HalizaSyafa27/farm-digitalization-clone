import React from 'react';
import styles from './PerbaruiButton.module.css';

interface PerbaruiButtonProps {
  label: string;
  onClick?: () => void;
}

const PerbaruiButton: React.FC<PerbaruiButtonProps> = ({ label, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
};

export default PerbaruiButton;
