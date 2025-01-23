import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import RenderHtml from 'react-native-render-html';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { Ionicons } from '@expo/vector-icons';
import { apiRequest } from '../../../utils/api';
interface LessonProps {
  id: number;
  onCompleted: () => void;
  onVideoIdChange: (videoId: string) => void; // Nouveau prop pour transmettre l'ID de la vidéo
}

interface LessonData {
  id: number;
  video_id: string;
  title: string;
  content: string;
}

const Lesson: React.FC<LessonProps> = ({ id, onCompleted, onVideoIdChange }) => {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const screenWidth = Dimensions.get('window').width;

  // Utilisation de useRef pour stocker l'ID de la leçon précédente
  const prevIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Vérifie si l'ID a changé par rapport à la dernière fois
    if (id === prevIdRef.current) {
      return; // Ne pas faire la requête si l'ID est le même
    }

    const fetchLesson = async () => {
      setLoading(true);
      try {
        const response = await apiRequest({ method: 'GET', url: `courses/lessons/${id}/` });
        const lessonData = response.data;

        setLesson(lessonData);
        setCompleted(lessonData.completed);

        // Appelez le callback avec l'ID de la vidéo une fois les données récupérées
        if (lessonData.video_id) {
          onVideoIdChange(lessonData.video_id);
        }

        if (lessonData.completed) {
          onCompleted();
        }

        // Mettre à jour l'ID précédent
        prevIdRef.current = id;
      } catch (err) {
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id, onCompleted, onVideoIdChange]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ShimmerPlaceholder
          style={{ width: screenWidth - 32, height: 30, marginBottom: 10, borderRadius: 7 }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ShimmerPlaceholder
            style={{ width: screenWidth - 32, height: 200, marginBottom: 10, borderRadius: 10 }}
          />
        </View>
        {Array.from({ length: 15 }).map((_, index) => (
          <ShimmerPlaceholder
            key={index}
            style={{ width: screenWidth - 32, height: 20, marginBottom: 10, borderRadius: 5 }}
          />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>{error}</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ color: 'gray', fontSize: 16 }}>No lessons found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="book" size={24} color="black" />
        <Text style={styles.title}>{lesson.title}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <RenderHtml
          contentWidth={screenWidth}
          source={{ html: lesson.content }}
          baseStyle={styles.text}
          tagsStyles={{
            pre: { backgroundColor: '#000', color: '#fff', padding: 10, borderRadius: 10, fontSize: 14 },
            code: { fontFamily: 'monospace', color: '#d63384' },
            h1: { fontSize: 20, fontWeight: 'bold', marginBottom: 0 },
            h2: { fontSize: 18, fontWeight: 'bold', marginBottom: 0 },
            h3: { fontSize: 16, fontWeight: 'bold', marginBottom: 0 },
          }}
        />
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  text: {
    fontSize: 16,
    textAlign: 'justify',
    lineHeight: 24,
    color: '#333',
    marginTop: 8,
  },
});

export default Lesson;
