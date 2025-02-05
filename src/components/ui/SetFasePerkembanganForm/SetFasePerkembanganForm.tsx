import React from "react";
import styles from "@/components/ui/SetFasePerkembanganForm/SetFasePerkembanganForm.module.css"

const SetFasePerkembanganForm: React.FC = () => {
  return (
    <div className={styles.umurTernakForm}>
      <h2 className={styles.formTitle}>Fase Perkembangan</h2>
      <div className={styles.formField}>
        <label htmlFor="hamil" className={styles.fieldLabel}>
          Durasi Kehamilan *bulan
        </label>
        <input type="number" id="hamil" className={styles.fieldInput} defaultValue="5" />
      </div>
      <div className={styles.formField}>
        <label htmlFor="menyusui" className={styles.fieldLabel}>
          Durasi Menyusui *bulan
        </label>
        <input type="number" id="menyusui" className={styles.fieldInput} defaultValue="3" />
      </div>
    </div>
  );
};

export default SetFasePerkembanganForm;