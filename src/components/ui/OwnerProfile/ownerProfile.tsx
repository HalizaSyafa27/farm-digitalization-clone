import React from "react";
import Image from "next/image";
import styles from "./OwnerProfile.module.css";

interface OwnerProfileProps {
  src: string;
  altText: string;
}

const OwnerProfile = ({ src, altText }: OwnerProfileProps) => {
  return (
    <div className={styles.container}>
      {/* Gambar */}
      <div className={styles.imageWrapper}>
        <img
         src="https://firebasestorage.googleapis.com/v0/b/manta-dive-75b30.firebasestorage.app/o/WhatsApp%20Image%202025-01-13%20at%2016.55.27.jpeg?alt=media&token=2d858012-93ad-4ff4-947a-4e243dface03"
          alt={altText}
          width={50}
          height={50}
          className={styles.image}
        />
      </div>
    </div>
  );
};

export default OwnerProfile;
