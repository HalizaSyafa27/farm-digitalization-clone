import React from "react";
import Image from "next/image";
import styles from "./OperatorProfile.module.css";

interface OperatorProfileProps {
  src: string;
  altText: string;
}

const OperatorProfile = ({ src, altText }: OperatorProfileProps) => {
  return (
    <div className={styles.container}>
      {/* Gambar */}
      <div className={styles.imageWrapper}>
        <img
         src="https://firebasestorage.googleapis.com/v0/b/manta-dive-75b30.firebasestorage.app/o/WhatsApp%20Image%202025-01-13%20at%2016.54.52.jpeg?alt=media&token=e8a489a5-121c-49d0-b6e1-3d37ea1eb7e3"
          alt={altText}
          width={50}
          height={50}
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default OperatorProfile;
