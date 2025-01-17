import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../utils/header';
import Background from '../utils/background';
import CourseList from '../course/list';
import HtmlRender from '../utils/htmlRender';
import { apiRequest } from '../../../utils/api';
import * as SecureStore from 'expo-secure-store';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; // Pour les icônes

const PathwayDetail = ({ route }: { route: any }) => {
  const { pathwayId } = route.params;
  const [pathwayData, setPathwayData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await SecureStore.getItemAsync('userData');
        const user = userData ? JSON.parse(userData) : null;
        setUserId(user?.id ?? null);

        const response = await apiRequest({ method: 'GET', url: `courses/pathways/${pathwayId}/` });
        setPathwayData(response.data);
      } catch (err) {
        setError('Failed to load pathway details: ' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathwayId]);

  const handleStartPathway = async () => {
    try {
      const response = await apiRequest({ method: 'POST', url: `learning/subscribe/pathway/`, data: { pathway_id: pathwayId } });
      if (response.status.toString().startsWith('2')) {
        navigation.navigate('CourseDetail', { courseId: pathwayData.courses_ids[0] });
      } else {
        setError('Failed to subscribe to the pathway.');
      }
    } catch (err) {
      setError('An error occurred: ' + err);
    }
  };

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (loading) {
    // Skeleton screen
    return (
      <>
        <Background />
        <Header title="Détail du parcours" profileEnabled={false} backEnabled={true} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0056D2" />
        </View>
      </>
    );
  }

  if (!pathwayData) {
    return <Text style={styles.errorText}>No pathway data found</Text>;
  }

  const enrolledUser = pathwayData.enrolled_users?.find((user: { user_id: number }) => user.user_id === userId);

  return (
    <>
      <Background />
      <Header title="Détail du parcours" profileEnabled={false} backEnabled={true} />
      <Image source={{ uri: pathwayData.image }} style={styles.image} />
      <Text style={styles.title}>{pathwayData.title}</Text>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HtmlRender description={pathwayData.description} />
        <View style={styles.coursesContainer}>
          <Text style={styles.coursesTitle}>Cours du parcours</Text>
          <CourseList pathwayId={pathwayId} />
        </View>
      </ScrollView>
      {enrolledUser && enrolledUser.status === 'in_progress' && (
        <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Course', { courseId: pathwayData.courses_ids[0] })} 
            activeOpacity={0.8}
        >
          <AntDesign name="playcircleo" size={24} color="white" />
          <Text style={styles.buttonText}>Continuer le cours</Text>
        </TouchableOpacity>
      )}
      {enrolledUser && enrolledUser.status === 'completed' && (
        <>
          <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.navigate('Certificate', { pathwayId: pathwayId })} 
              activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="certificate" size={24} color="white" />
            <Text style={styles.buttonText}>Voir le certificat</Text>
          </TouchableOpacity>
        </>
      )}
      {!enrolledUser && (
        <TouchableOpacity 
            style={styles.button} 
            onPress={handleStartPathway} 
            activeOpacity={0.8}
        >
          <AntDesign name="playcircleo" size={24} color="white" />
          <Text style={styles.buttonText}>Commencer le parcours</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 8,
  },
  coursesContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  coursesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0056D2',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PathwayDetail;
