import React from 'react';
import styles from '@/components/ui/UpdateButton/UpdateButton.module.css';

interface UpdateButtonProps {
  onClick?: () => void;
  label?: string;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ onClick, label = "Ubah Data" }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
};

export default UpdateButton;