import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface CourseCardProps {
  id: string;
  title: string;
  category: any;
  imageUrl: string;
}

const CourseMiniCard: React.FC<CourseCardProps> = ({ id, title, category, imageUrl }) => {
  const navigation = useNavigation();
  const formattedTitle = title.length > 35 ? title.slice(0, 35) + '…' : title;

  return (
    <TouchableOpacity
        key={id}
        onPress={() => navigation.navigate('CourseDetail', { courseId: id })}
        activeOpacity={0.8}
        style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{formattedTitle}</Text>
        {category && (
          <View style={styles.categoryContainer}>
            <MaterialIcons name="category" size={20} color={category.color} />
            <Text style={[styles.category, { color: category.color }]}>{category.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 16,
    width: 200,
  },
  image: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  info: {
    padding: 8,
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
    fontSize: 14,
    marginLeft: 4, // Space between icon and text
  },
});

export default CourseMiniCard;
