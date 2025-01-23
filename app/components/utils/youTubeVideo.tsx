import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

interface YouTubeVideoProps {
  videoId: string;
  isPortrait: boolean
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
  videoId, isPortrait
}) => {
  return (
    <View style={isPortrait ? styles.container : styles.noPortraitContainer}>
      <WebView
        source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
        style={[styles.webView]} // Combine les styles fixes et dynamiques
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        mediaPlaybackRequiresUserAction={false} // Lecture automatique
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10, // Ajoute du rounded
    overflow: 'hidden', // Cache le dépassement
    height:200,
    backgroundColor: '#000',
    marginVertical:10,
  },
  noPortraitContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    height:'100%',
    width: '100%',
    backgroundColor: '#000',
  },
  webView: {
    borderRadius: 10, // Ajoute du rounded
    height: "100%",
    width: "100%",
    flex: 0, // Empêche le dépassement automatique
    backgroundColor: '#000',

  },
});

export default YouTubeVideo;
