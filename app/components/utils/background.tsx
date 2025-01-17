import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

const Background: React.FC = ({ children }) => {
  return (
    <LinearGradient
        colors={['#F4F4F5', '#E3FFFE']}
        style={{ 
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '110%',
        justifyContent: 'center',
        alignItems: 'center' 
        }}
    >
      {children}
    </LinearGradient>
  )
}

export default Background;