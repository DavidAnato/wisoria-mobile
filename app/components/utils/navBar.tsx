import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const NavBar = ({ active }: { active: string }) => {
  const navigation = useNavigation();
  const getIconName = (icon: string) => {
    switch (icon) {
      case "compass":
        return active === "home" ? "compass" : "compass-outline";
      case "school":
        return active === "learn" ? "school" : "school-outline";
      case "search":
        return active === "search" ? "search" : "search-outline";
      case "profile":
        return active === "profile" ? "person" : "person-outline";
      default:
        return `${icon}-outline`;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Home' as never)}
        activeOpacity={0.8}
      >
        <Ionicons name={getIconName("compass")} size={24} color={active === "home" ? "#0056D2" : "#7C7C7C"} />
        <Text style={active === "home" ? styles.activeText : styles.inactiveText}>Explorer</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Learn' as never)}
        activeOpacity={0.8}
      >
        <Ionicons name={getIconName("school")} size={24} color={active === "learn" ? "#0056D2" : "#7C7C7C"} />
        <Text style={active === "learn" ? styles.activeText : styles.inactiveText}>Apprendre</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Search' as never)}
        activeOpacity={0.8}
      >
        <Ionicons name={getIconName("search")} size={24} color={active === "search" ? "#0056D2" : "#7C7C7C"} />
        <Text style={active === "search" ? styles.activeText : styles.inactiveText}>Rechercher</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate('Profile' as never)}
        activeOpacity={0.8}
      >
        <Ionicons name={getIconName("profile")} size={24} color={active === "profile" ? "#0056D2" : "#7C7C7C"} />
        <Text style={active === "profile" ? styles.activeText : styles.inactiveText}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 88, // Set height to 88px
    borderTopLeftRadius: 40, // Set top-left radius to 24px
    borderTopRightRadius: 40, // Set top-right radius to 24px
    paddingVertical: 10,
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  activeText: {
    fontSize: 12,
    color: '#0056D2',
    fontWeight: 'bold',
  },
  inactiveText: {
    fontSize: 12,
    color: '#7C7C7C',
  },
});

export default NavBar;
