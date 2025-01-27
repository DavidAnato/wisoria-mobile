import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions, BackHandler, ToastAndroid } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import Lesson from "./lesson";
import Background from '../utils/background';
import Header from '../utils/header';
import { Course as CourseData, Chapter as ChapterData } from '../../../utils/types';
import { apiRequest } from '../../../utils/api';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import YouTubeVideo from '../utils/youTubeVideo';

interface CourseProps {
  courseId: number;
  currentChapterId?: number;
}

const Course: React.FC<CourseProps> = ({ courseId, currentChapterId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lessonIds, setLessonIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterTitle, setChapterTitle] = useState<string>('');
  const [completedLesson, setCompletedLesson] = useState<boolean>(false);
  const [quizId, setQuizId] = useState<number>(0);
  const [currentChapterIdState, setCurrentChapterIdState] = useState<number>(0);
  const [everyLessonCompleted, setEveryLessonCompleted] = useState<boolean>(false);
  const [isLastChapter, setIsLastChapter] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string>('');

  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!isPortrait) {
          ToastAndroid.show("Mettez votre telephone en portait pour quitter le mode plein ecran", ToastAndroid.SHORT)
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );


  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseResponse = await apiRequest({ method: 'GET', url: `courses/courses/${courseId}/` });
        const courseData: CourseData = courseResponse.data;
        
        if (courseData.chapters_ids.length > 0) {
          const progressChapterId = courseData.chapters_completed ? courseData.chapters_ids.find(chapterId => !courseData.chapters_completed.includes(chapterId)) : courseData.chapters_ids[0];
          const chapterId = currentChapterId ? courseData.chapters_ids[courseData.chapters_ids.findIndex(chapterId => chapterId === currentChapterId) + 1] : progressChapterId ? progressChapterId : courseData.chapters_ids[0];
          setCurrentChapterIdState(chapterId);
          const chapterResponse = await apiRequest({ method: 'GET', url: `courses/chapters/${chapterId}/` });
          const chapterData: ChapterData = chapterResponse.data;
          setLessonIds(chapterData.lessons.map((lesson: { id: number }) => lesson.id));
          setChapterTitle(chapterData.title);
          setQuizId(chapterData.quiz);
          setEveryLessonCompleted(chapterData.lessons.every(lesson => lesson.completed));
          setIsLastChapter(chapterData.is_last);
          console.log(chapterData.is_last)
          const firstIncompleteLesson = chapterData.lessons.find(lesson => !lesson.completed);
          if (firstIncompleteLesson) {
            setCurrentIndex(chapterData.lessons.findIndex(lesson => lesson.id === firstIncompleteLesson.id));
          }
        }
      } catch (err) {
        setError('Failed to load course or chapter data: ' + err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const markAsCompleted = async (lessonId: number) => {
    try {
      await apiRequest({
        method: 'POST',
        url: '/learning/user/lesson/',
        data: { lesson_id: lessonId },
      });
      setCompletedLesson(true);
    } catch (err: any) {
      ToastAndroid.show('Failed to mark lesson as completed: ', ToastAndroid.SHORT);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCompletedLesson(true); // Reset completion status when moving to the previous lesson
    }
  };
  
  const handleNext = async (lessonId: number) => {
    try {
      await markAsCompleted(lessonId); // Attendez la fin de l'appel avant de continuer
      if (currentIndex < lessonIds.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCompletedLesson(false); // Réinitialisez le statut de complétion
      }
    } catch (error) {
      ToastAndroid.show('Failed to move to the next lesson', ToastAndroid.SHORT);
    }
  };
  
  const handleGoToQuiz = async (lessonId: number) => {
    try {
      await markAsCompleted(lessonId); // Attendez la fin de l'appel
      navigation.navigate('Quiz', {
        quizId,
        currentChapterId: currentChapterIdState,
        courseId,
      });
    } catch (error) {
      ToastAndroid.show('Failed to mark lesson as completed before quiz', ToastAndroid.SHORT);
    }
  };
  
  const handleGetCertificate = async (lessonId: number) => {
    try {
      await markAsCompleted(lessonId); // Attendez la fin de l'appel
      navigation.navigate('Certificate', { courseId });
    } catch (error) {
      ToastAndroid.show('Failed to mark lesson as completed before certificate', ToastAndroid.SHORT);
    }
  };
  
  const handleSetVideoId = (newVideoId:string) => {
    if (videoId !== newVideoId) {
      setVideoId(newVideoId)
    }
  };

  if (loading) {
    return (
      <>
        <Background />
        <Header title={chapterTitle} homeEnabled={true} backEnabled={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </>
    );
  }
  
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>{error}</Text>
      </View>
    );
  }

  if (lessonIds.length === 0) {
    return (
      <>
        <Background />
        <Header title={chapterTitle} homeEnabled={true} backEnabled={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={{ color: 'gray', fontSize: 16 }}>No lessons found</Text>
        </View>
      </>
    );
  }

  const lessonId = lessonIds[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === lessonIds.length - 1;

  
  return (
    <>
      <Background />
      {isPortrait && <Header title={chapterTitle} homeEnabled={true} backEnabled={true} />}
      <View style={styles.container}>
        <View style={!isPortrait ? styles.videoContainer : ''}>
          <YouTubeVideo isPortrait={isPortrait} videoId={videoId}/>
          {!isPortrait &&
          <TouchableOpacity 
            onPress={() => {ToastAndroid.show("Mettez votre telephone en portait pour quitter le mode plein ecran", ToastAndroid.SHORT)}}
            style={{ height:50, width:50, backgroundColor:'#F0F0F0', borderRadius:'50%', display:'flex', justifyContent:'center' , alignItems:'center', position:'absolute', top: 15, right:20}}>
            <FontAwesome6 name="xmark" size={24} color="black" />
          </TouchableOpacity>}
        </View>
        <Lesson id={lessonId} onVideoIdChange={(newVideoId) => handleSetVideoId(newVideoId)} onCompleted={() => setCompletedLesson(true)} />
      </View>
      {isPortrait && 
      <View style={[styles.buttonContainer]}>
        {!isFirst && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={handlePrevious}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.buttonText}>Précédent</Text>
          </TouchableOpacity>
        )}

        {isLast && !isLastChapter ? (
          <TouchableOpacity
          style={[styles.button, styles.quizButton]}
          activeOpacity={0.8}
          onPress={() => handleGoToQuiz(lessonId)}
          >
            <Text style={styles.buttonText}>Quizz</Text>
            <MaterialIcons name="quiz" size={24} color="white" />
          </TouchableOpacity>
        ) : isLastChapter ? (
          <TouchableOpacity 
          style={styles.button} 
          onPress={() => handleGetCertificate(lessonId)}
        >
          <Text style={[styles.buttonText, {flex:1}]}>Obtenir le certificat</Text>
          <MaterialCommunityIcons name="certificate" size={24} color="white" />
          </TouchableOpacity>

        ) : 
        <TouchableOpacity 
          style={[styles.button, {backgroundColor:'#0056D2'}]} 
          onPress={() => handleNext(lessonId)}
        >
          <Text style={styles.buttonText}>Suivant</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
        }
      </View>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fond sombre avec opacité
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 8,
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056D2',
    padding: 10,
    borderRadius: 15,
  },
  finishButton: {
    backgroundColor: '#28a745',
  },
  restartButton: {
    backgroundColor: '#999',
  },
  quizButton: {
    backgroundColor: '#F4A002',
  },
  buttonText: {
    color: 'white',
    margin: 8,
  },
});

export default Course;
