import React from 'react';
import styles from './RejectButton.module.css';

interface RejectButtonProps {
  label: string;
  onClick?: () => void;
}

const RejectButton: React.FC<RejectButtonProps> = ({ label, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
};

export default RejectButton;
