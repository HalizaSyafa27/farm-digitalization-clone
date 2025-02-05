import React from 'react';

const LoadingComponent: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.loader}>
        <div style={{ ...styles.dot, animationDelay: '0s' }}></div>
        <div style={{ ...styles.dot, animationDelay: '0.2s' }}></div>
        <div style={{ ...styles.dot, animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',
    margin: 0,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    animation: 'bounce 1.2s infinite ease-in-out',
  },
  '@keyframes bounce': {
    '0%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
    '100%': {
      transform: 'translateY(0)',
    },
  },
};

export default LoadingComponent;
