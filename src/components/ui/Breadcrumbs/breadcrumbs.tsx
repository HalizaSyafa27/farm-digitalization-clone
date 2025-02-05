'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import styles from './Breadcrumbs.module.css';

interface Breadcrumb {
    label: string;
    href: string;
  }
  
  interface BreadcrumbsProps {
    breadcrumbs: Breadcrumb[];
  }


const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
    const pathname = usePathname();
    
    return (
      <nav className={styles.breadcrumbs}>
              {breadcrumbs.map((breadcrumb, index) => {
                const isActive = pathname === breadcrumb.href;
                return (
                <React.Fragment key={breadcrumb.href}>
                    <Link 
                    href={breadcrumb.href} 
                    className={`${styles.link} ${isActive ? styles.active : ''}`}
                    >
                    {breadcrumb.label}
                    </Link>
                    {index < breadcrumbs.length - 1 && (
                    <span className={styles.separator}>/</span>
                    )}
                </React.Fragment>
                );
            })}
      </nav>
    );
  };

export default Breadcrumbs;
