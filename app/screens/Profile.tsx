import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../components/utils/header';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { apiRequest } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import Background from '../components/utils/background';
import NavBar from '../components/utils/navBar';

interface ProfileData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  picture_url: string;
}

const Profile = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await apiRequest({ method: 'GET', url: 'users/profile/' });
        setProfileData(response.data);
        await SecureStore.setItemAsync('userData', JSON.stringify(response.data));
      } catch (err) {
        setError('Failed to load profile data: ' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('userData');
    navigation.navigate('Auth' as never);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0056D2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out" size={24} color="#FFFFFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Background/>
      <NavBar active='profile'></NavBar>
      {/* <Header title="Mon Profil" backEnabled homeEnabled={false} profileEnabled={false} backgroundColor="#0056D2" color="#fff" /> */}
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.headerBackground} />
          {profileData && (
            <>
              <Image
                source={{ uri: profileData.profile_picture || profileData.picture_url }}
                style={styles.profilePicture}
              />
              <Text style={styles.name}>
                {profileData.first_name} {profileData.last_name}
              </Text>
              <Text style={styles.email}>{profileData.email}</Text>
            </>
          )}
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Bio Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>À propos</Text>
            <Text style={styles.sectionContent}>
              Passionné par l'apprentissage en ligne et le développement personnel, je suis toujours curieux de découvrir de nouvelles compétences.
            </Text>
          </View>

          {/* Skills Section */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Compétences</Text>
            <View style={styles.skillsGrid}>
              {['JavaScript', 'Python', 'Gestion de projet Agile', 'React Native'].map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Navigation Links */}
          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('MesCours' as never)}>
            <Text style={styles.linkText}>Mes Cours</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('MesCertificats' as never)}>
            <Text style={styles.linkText}>Mes Certificats</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 100,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  headerBackground: {
    height: 150,
    width: '100%',
    backgroundColor: '#0056D2',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: -50,
    borderWidth: 3,
    borderColor: '#FFF',
    backgroundColor: '#f1f1f1'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillBadge: {
    backgroundColor: '#E8F0FE',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  skillText: {
    fontSize: 14,
    color: '#0056D2',
    fontWeight: '600',
  },
  linkButton: {
    backgroundColor: '#0056D2',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#C0392B',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#C0392B',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default Profile;
