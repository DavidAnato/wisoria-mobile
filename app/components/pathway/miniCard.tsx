import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
interface PathwayCardProps {
  id: string;
  title: string;
  category: any;
  image: string;
  description: string;
}

const PathwayMiniCard: React.FC<PathwayCardProps> = ({ id, title, category, image, description }) => {
  const navigation = useNavigation();
  const formattedTitle = title.length > 35 ? title.slice(0, 35) + '…' : title;

  return (
    <TouchableOpacity
        key={id}
        onPress={() => navigation.navigate('PathwayDetail', { pathwayId: id })}
        activeOpacity={0.8}
        style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        {category && (
          <View style={styles.categoryContainer}>
            <MaterialIcons name="category" size={16} color={category.color} />
            <Text style={[styles.category, { color: category.color }]}>{category.name}</Text>
          </View>
        )}
        <Text style={styles.title}>{formattedTitle}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
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
    width: 180,
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
  description: {
    fontSize: 12,
    color: '#555',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#FF4500', // more dark orange
    marginLeft: 4, // Space between icon and text
  },
});

export default PathwayMiniCard;
