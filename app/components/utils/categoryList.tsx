import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { apiRequest } from "../../../utils/api";
import { useState, useEffect } from "react";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

// Importez toutes les icônes nécessaires ici
const iconMap: Record<string, any> = {
    dev: require('../../../assets/images/icons/dev.png'),
    ai: require('../../../assets/images/icons/ai.png'),
    cloud_computing: require('../../../assets/images/icons/cloud-computing.png'),
    ui_ux: require('../../../assets/images/icons/ui-ux.png'),
    data_science: require('../../../assets/images/icons/data-science.png'),
    cybersecurity: require('../../../assets/images/icons/cybersecurity.png'),
    marketing: require('../../../assets/images/icons/marketing.png'),
    project_management: require('../../../assets/images/icons/project-management.png'),
};

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await apiRequest({
                    method: 'GET',
                    url: `courses/categories/`
                });
                setCategories(response.data);
            } catch (err) {
                setError("Failed to load categories: " + err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        // Skeleton screen
        return (
            <View style={styles.categoryList}>
                {Array.from({ length: 7 }).map((_, index) => (
                    <View key={index} style={[styles.skeletonButton]}>
                        <View style={styles.skeletonIcon} />
                        <View style={styles.skeletonText} />
                    </View>
                ))}
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.categoryList}>
            {categories.map((category: any) => (
                <TouchableOpacity
                    key={category.id}
                    onPress={() => {
                        navigation.navigate('Filter', { category: category });
                    }}
                    activeOpacity={0.8}
                    style={[styles.categoryButton, { backgroundColor: category.color }]}>
                    {/* Vérifiez si l'icône existe dans le mapping */}
                    {iconMap[category.icon] ? (
                        <Image source={iconMap[category.icon]} style={styles.categoryImage} />
                    ) : (
                        <Feather name="image" size={24} color="gray" />
                    )}
                    <Text style={styles.categoryText}>{category.name}</Text>
                    <Feather name="arrow-up-right" size={24} color="white" />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    categoryList: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        marginRight: 5,
    },
    categoryImage: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontWeight: 'bold',
    },
    // Skeleton styles
    skeletonButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3e3e3',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        height: 50,
        width: 150,
    },
    skeletonIcon: {
        width: 20,
        height: 20,
        backgroundColor: '#d1d1d1',
        borderRadius: 5,
        marginRight: 10,
    },
    skeletonText: {
        width: 100,
        height: 10,
        backgroundColor: '#d1d1d1',
        borderRadius: 5,
    },
});

export default CategoryList;
