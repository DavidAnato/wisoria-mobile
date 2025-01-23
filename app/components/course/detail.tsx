import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Background from '../utils/background';
import HtmlRender from '../utils/htmlRender';
import { apiRequest } from '../../../utils/api';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for secure storage
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; // Import AntDesign for icons
import Header from '../utils/header';

const CourseDetail = ({ route }: { route: any }) => {
  const { courseId } = route.params;
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await apiRequest({ method: 'GET', url: `courses/courses/${courseId}/` });
        setCourseData(response.data);
      } catch (err) {
        setError('Failed to load course details: ' + err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserId = async () => {
      const userData = await SecureStore.getItemAsync('userData');
      const user = userData ? JSON.parse(userData) : null;
      setUserId(user ? user.id : null);
    };

    if (courseId) {
      fetchCourseDetail();
      fetchUserId();
    }
  }, [courseId, userId]);

  const handleStartCourse = async () => {
    try {
      const response = await apiRequest({ method: 'POST', url: `learning/subscribe/course/`, data: { course_id: courseId } });
      if (response.status.toString().startsWith('2')) {
        navigation.navigate('Course', { courseId });
      }
    } catch (err: any) {
      if (err.response.data.already_subscribed) {
        ToastAndroid.show('Vous êtes déjà inscrit à ce cours', ToastAndroid.SHORT);
        navigation.navigate('Course', { courseId });
      }
    }
  };

  if (loading) {
    return (
      <>
        <Background />
        <Header title="Détail du cours" profileEnabled={false} backEnabled={true} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0056D2" />
        </View>
      </>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!courseData) {
    return <Text>No course data found</Text>;
  }

  const enrolledUser = courseData.enrolled_users?.find((user: { user_id: number }) => user.user_id === userId);

  return (
    <>
      <Background />
      <Image source={{ uri: courseData.image }} style={styles.image} />
      <TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
        <AntDesign name="left" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{courseData.title}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <HtmlRender description={courseData.description} />
      </ScrollView>
      {enrolledUser && enrolledUser.status !== 'completed' && (
        <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Course', { courseId })} 
            activeOpacity={0.8}
        >
          <AntDesign name="playcircleo" size={24} color="white" />
          <Text style={styles.buttonText}>Continuer le cours</Text>
        </TouchableOpacity>
      )}
      {enrolledUser && enrolledUser.status === 'completed' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.navigate('Course', { courseId })} 
              activeOpacity={0.8}
          >
            <AntDesign name="reload1" size={24} color="white" />
            <Text style={styles.buttonText}>Revoir le cours</Text>
          </TouchableOpacity>
      
          <TouchableOpacity 
              style={styles.button} 
              onPress={() => navigation.navigate('Certificate', { courseId })} 
              activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="certificate" size={24} color="white" />
            <Text style={styles.buttonText}>Voir le certificat</Text>
          </TouchableOpacity>
        </View>
      )}
      {!enrolledUser && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
              style={styles.button} 
              onPress={handleStartCourse} 
              activeOpacity={0.8}
        >
          <AntDesign name="playcircleo" size={24} color="white" />
          <Text style={styles.buttonText}>Commencer le cours</Text>
            </TouchableOpacity>
        </View>
      )}
    </>
  );
};


const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 10,
  },
  container: {
    paddingHorizontal: 20,
  },
  backbutton: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 100,
    height: 40,
    width: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
    left: 20,
    zIndex: 1000,
  },
  image: {
    width: '100%',
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  button: {
    backgroundColor: '#0056D2',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
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

});

export default CourseDetail;