import React from "react";
import styles from "@/components/ui/SetUmurTernakForm/SetUmurTernakForm.module.css"; // Import the CSS file

const SetUmurTernakForm: React.FC = () => {
  return (
    <div className={styles.umurTernakForm}>
      <h2 className={styles.formTitle}>Umur Ternak</h2>
      <div className={styles.formField}>
        <label htmlFor="cempe" className={styles.fieldLabel}>
          Umur Saat Mulai Fase Cempe *bulan
        </label>
        <input type="number" id="cempe" className={styles.fieldInput} defaultValue="3" />
      </div>
      <div className={styles.formField}>
        <label htmlFor="betina" className={styles.fieldLabel}>
          Umur Saat Mulai Fase Dara (Betina) *bulan
        </label>
        <input type="number" id="betina" className={styles.fieldInput} defaultValue="12" 
        />
      </div>
      <div className={styles.formField}>
        <label htmlFor="pejantan" className={styles.fieldLabel}>
          Umur Saat Mulai Fase Siap Kawin (Pejantan) *bulan
        </label>
        <input type="number" id="pejantan" className={styles.fieldInput} defaultValue="12" />
      </div>
    </div>
  );
};

export default SetUmurTernakForm;