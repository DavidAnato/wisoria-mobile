import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface CourseCardProps {
  id: string;
  title: string;
  category: any;
  imageUrl: string;
  level: string;
}

const CourseLargeCard: React.FC<CourseCardProps> = ({ id, title, category, imageUrl, level }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
        key={id} 
        onPress={() => navigation.navigate('CourseDetail', { courseId: id })}
        activeOpacity={0.8}
        style={styles.card}>
        <View style={styles.info}>
        {level && (
          <View style={styles.levelContainer}>
            <MaterialIcons name="school" size={16} color="#777" />
            <Text style={[styles.level]}>{level}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        {category && (
          <View style={styles.categoryContainer}>
            <MaterialIcons name="category" size={20} color={category.color} />
            <Text style={[styles.category, { color: category.color }]}>{category.name}</Text>
          </View>
        )}
      </View>
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    width: "100%",
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginLeft: 12,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 16,
    marginLeft: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  level: {
    fontSize: 14,
    marginLeft: 4,
    color: "#555",
  },
});

export default CourseLargeCard;
