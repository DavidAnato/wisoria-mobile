import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';

const CoursesHeader = ({
  title = 'Wisoria',
  backEnabled = false,
  backgroundColor = '#F4F4F5',
  color = '#000000',
  onMenuPress,
}: {
  title: string;
  backEnabled?: boolean;
  backgroundColor?: string;
  color?: string;
  onMenuPress?: () => void;
}) => {  const navigation = useNavigation();
  

  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const marginTop = isPortrait ? 10 : 0;

  let truncatedTitle = title;
  if (isPortrait) {
    truncatedTitle = title.length > 25 ? `${title.substring(0, 23)}…` : title;
  } else {
    truncatedTitle = title.length > 70 ? `${title.substring(0, 70)}…` : title;
  }

  return (
    <View style={[styles.container, { backgroundColor, marginTop }]}>
      <View style={styles.leftContainer}>
      {backEnabled && (
        <TouchableOpacity 
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
        >
          <AntDesign name="left" size={24} color={color} marginRight={20} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, {color: color}]}>{truncatedTitle}</Text>
      </View>
        <TouchableOpacity 
            style={{ padding: 7, backgroundColor: '#FFA600', borderRadius: 100 }}
            onPress={onMenuPress}
            activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="menu" size={26} color="#FFF" />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: '#00FF00', // Green point
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFFFFF', // White border for contrast
  },
});


export default CoursesHeader;
