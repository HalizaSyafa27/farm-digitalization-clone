import React, { useState } from "react";
import styles from "./MoreCardDelete.module.css";

export default function MoreCardDelete() {

  return (
    <div className={styles.card}>
      <ul className={styles.list}>
        {/* Lihat Data Ternak */}


        {/* Tambah Data Ternak */}


        {/* Perbarui Data Ternak */}


   
        
        {/* Delete */}
        <li
          className={styles.listItem}
          onClick={() => alert("Delete clicked!")}
        >
          <span className={styles.deleteText}>Delete</span>
        </li>
      </ul>
    </div>
  );
}

