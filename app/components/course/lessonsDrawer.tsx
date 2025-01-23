import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, PanResponder, Modal, StatusBar, ToastAndroid, ScrollView, ImageBackground } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { apiRequest } from '../../../utils/api';
import NavBar from '../utils/navBar';

const LessonsDrawer = ({ onClose, courseId }: { onClose: () => void; courseId: any }) => {
  const [courseSummary, setCourseSummary] = useState<any>();
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(-500)).current;
  
  useEffect(() => {
    const fetchCourseSummary = async () => {
      try {
        const response = await apiRequest({ method: 'GET', url: `courses/course-summary/${courseId}/` });
        setCourseSummary(response.data);
      } catch (err) {
        ToastAndroid.show("Erreur lors de la recuperation du sommaire", ToastAndroid.SHORT);
      }
    };
    fetchCourseSummary();
  }, [courseId]);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(translateX, {
      toValue: -500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const navigateToLesson = (courseId: any, currentChapterId: any, currentChapterTitle: any, lessonId: any) => {
    handleClose();
    navigation.navigate('Course', { courseId, currentChapterId, currentChapterTitle, lessonId });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dx < -100) {
          handleClose();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  NavigationBar.setVisibilityAsync('hidden');

  return (
    <View
      style={styles.modal}
    >
      <StatusBar hidden={true} />
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.background}>
          <Animated.View
            style={[styles.container, { transform: [{ translateX }] }]}
            {...panResponder.panHandlers}
          >
            {courseSummary && (
              <View style={styles.content}>
                <ImageBackground
                  source={{ uri: courseSummary.image }} // Utilisez courseSummary.image pour l'URL de l'image
                  style={styles.backgroundImage}
                >
                  <View style={styles.header}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.courseTitle}>{courseSummary.title}</Text>
                      <Text style={styles.courseLevel}>Niveau : {courseSummary.level}</Text>
                      <Text style={styles.courseDuration}>{courseSummary.duration}h</Text>
                    </View>
                  </View>
                </ImageBackground>


                <ScrollView style={styles.chaptersContainer}>
                  {courseSummary.chapters.map((chapter: any) => (
                    <View key={chapter.id} style={styles.chapterSection}>
                      <View style={styles.chapterHeader}>
                        <View style={styles.chapterTitleContainer}>
                          <Text style={styles.chapterTitle}>{chapter.title}</Text>
                          {chapter.progress?.completed && (
                            <FontAwesome5 name="check-circle" size={20} color="#4CAF50" />
                          )}
                        </View>
                      </View>

                      {chapter.lessons.map((lesson: any) => (
                        <TouchableOpacity
                          key={lesson.id}
                          style={styles.lessonItem}
                          onPress={() => navigateToLesson(courseId, chapter.id-1, chapter.title, lesson.id)}
                        >
                          <View style={styles.lessonContent}>
                            <FontAwesome5 name="play-circle" size={20} color="#555" style={styles.lessonIcon} />
                            <Text style={styles.lessonTitle}>{lesson.title}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}

                      {chapter.quiz && (
                        <View style={styles.quizContainer}>
                          <View style={styles.quizHeader}>
                            <Text style={styles.quizTitle}>{chapter.quiz.title}</Text>
                            {chapter.quiz.result && (
                              <View style={[
                                styles.quizResult,
                                { backgroundColor: chapter.quiz.result.success ? '#E8F5E9' : '#FFEBEE' }
                              ]}>
                                <Text style={styles.quizScore}>
                                  {chapter.quiz.result.percentage}%
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
                <NavBar active='' />
              </View>
            )}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  background: {
    height: "100%",
    backgroundColor: "#0005",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
  },
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  backgroundImage: {
    justifyContent: 'center', // Centre le contenu verticalement
    alignItems: 'center', // Centre le contenu horizontalement
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Couche semi-transparente pour améliorer la lisibilité du texte
    padding: 20,
    alignItems: 'center',
  },

  titleContainer: {
    marginTop: 20,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  courseLevel: {
    fontSize: 16,
    color: '#B0BEC5',
    marginBottom: 4,
  },
  courseDuration: {
    fontSize: 14,
    color: '#B0BEC5',
  },
  chaptersContainer: {
    flex: 1,
  },
  chapterSection: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  chapterHeader: {
    padding: 15,
    backgroundColor: '#F5F5F5',
  },
  chapterTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  lessonItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonIcon: {
    marginRight: 12,
  },
  lessonTitle: {
    fontSize: 16,
    color: '#424242',
    flex: 1,
  },
  quizContainer: {
    padding: 15,
    backgroundColor: '#F8F9FA',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
  },
  quizResult: {
    padding: 6,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  quizScore: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LessonsDrawer;