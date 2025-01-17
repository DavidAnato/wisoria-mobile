import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { formatDate } from '../../../utils/fonction';
import { useNavigation } from '@react-navigation/native';

interface CourseCardProps {
  id: number;
  title: string;
  category: { name: string; color: string };
  progress: number;
  startDate: string;
  updatedDate: string;
  endDate: string;
  image: string;
}

const MyCourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  category,
  progress,
  startDate,
  updatedDate,
  endDate,
  image,
}) => {
  const navigation = useNavigation();
  const radius = 15; // Rayon du cercle
  const strokeWidth = 4; // Épaisseur de la bordure
  const circumference = 2 * Math.PI * radius; // Circonférence du cercle
  const progressOffset = circumference - (progress / 100) * circumference;
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(progress < 100 ? 'Course' : 'Certificate', { courseId: id, courseTitle: title })} activeOpacity={0.8}>
      <View style={styles.header}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.textContainer}>
          {category && (
            <Text style={[styles.category, { color: category.color }]}>{category.name}</Text>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressCircle}>
          <Svg height="40" width="40">
            <Circle
              cx="20"
              cy="20"
              r={radius}
              stroke="#e5e7eb" // Couleur de l'arrière-plan
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx="20"
              cy="20"
              r={radius}
              stroke="#16a34a" // Couleur de progression
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        <Text style={styles.progressLabel}>de progression</Text>
      </View>

      <Text style={styles.date}>
        Démarré le : <Text style={styles.bold}>{formatDate(startDate, false)}</Text>
      </Text>

      {endDate ? (
        <Text style={styles.date}>
          Fin le : <Text style={styles.bold}>{formatDate(endDate, false)}</Text>
        </Text>
      ) : updatedDate ? (
        <Text style={styles.date}>
          Dernière mise à jour le : <Text style={styles.bold}>{formatDate(updatedDate, false)}</Text>
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  category: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 8,
  },
  progressText: {
    position: 'absolute',
    fontSize: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 12,
    color: '#333',
  },
  date: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MyCourseCard;
