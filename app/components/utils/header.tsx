import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {AntDesign, Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for secure storage
import { User } from '../../../utils/types'; // Import User type

const getUser = async () => {
  const user = await SecureStore.getItemAsync('userData');
  return user ? JSON.parse(user) : null; // Parse user data if it exists
}

const Header = ({ title = 'Wisoria', backEnabled = false, backgroundColor = '#F4F4F5', color = '#000000', homeEnabled = false, profileEnabled = true }: { title: string; backEnabled?: boolean; backgroundColor?: string; color?: string; homeEnabled?: boolean; profileEnabled?: boolean }) => {
  const navigation = useNavigation();
  const [user, setUser] = React.useState<User | null>(null); // Use User type for state
  
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser(); // Wait for the promise to resolve
      setUser(userData); // Update state with user data
    };

    fetchUser(); // Call fetchUser to get user data
  }, []);

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
      {homeEnabled ? (
          <TouchableOpacity 
              style={{ padding: 7, backgroundColor: '#FFA600', borderRadius: 100 }}
              onPress={() => navigation.navigate('Home' as never)}
              activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="home-variant" size={26} color="#FFF" />
          </TouchableOpacity>
      ): profileEnabled ? (
        <View style={[styles.imageContainer, {borderColor: color}]}>
          <TouchableOpacity 
              onPress={() => navigation.navigate('Profile' as never)}
              activeOpacity={0.8}
          >
            {!user?.picture_url ? (
              <AntDesign name="user" size={30} color={color} />
            ) : (
              <Image 
                source={{ uri: user.picture_url }} 
                style={styles.profileImage} 
              />
            )}
          </TouchableOpacity>
          <View style={styles.onlineIndicator} />
        </View>
      ): null}
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

// Update the border color dynamically based on the passed color prop
const dynamicStyles = (color: string) => ({
  imageContainer: {
    borderColor: color,
  },
});

export default Header;
