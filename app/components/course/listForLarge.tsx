import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import CourseLargeCard from "./largeCard"; // Importing the large card component
import { useNavigation } from "@react-navigation/native";
import { Course } from "../../../utils/types";
import { apiRequest } from "../../../utils/api";

const CourseListForLarge = ({ pathwayId }: { pathwayId?: number }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await apiRequest({ method: 'GET', url: `courses/courses/${pathwayId ? `?pathway_id=${pathwayId}` : ''}` });
                setCourses(response.data.results);
            } catch (err) {
                setError("Failed to load courses: " + err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [pathwayId]);

    if (loading) {
        // Skeleton screen
        return (
            <View style={styles.container}>
                <View>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <View key={index} style={styles.skeletonCard}>
                            <View style={styles.skeletonTextContainer}>
                                <View style={styles.skeletonText} />
                                <View style={styles.skeletonTextSmall} />
                            </View>
                            <View style={styles.skeletonImage} />
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {courses.map(course => (
                    <CourseLargeCard 
                        key={course.id}
                        id={course.id.toString()}
                        title={course.title} 
                        category={course.category} 
                        imageUrl={course.image || ''} 
                        level={course.level || ''}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0,
        borderRadius: 10,
    },
    // Skeleton styles
    skeletonCard: {
        flexDirection: 'row',
        backgroundColor: '#e3e3e3',
        borderRadius: 10,
        marginBottom: 15,
        padding: 15,
        alignItems: 'center',
    },
    skeletonTextContainer: {
        flex: 1,
        marginRight: 10,
    },
    skeletonText: {
        height: 20,
        width: '80%',
        backgroundColor: '#d1d1d1',
        borderRadius: 5,
        marginBottom: 10,
    },
    skeletonTextSmall: {
        height: 15,
        width: '60%',
        backgroundColor: '#d1d1d1',
        borderRadius: 5,
    },
    skeletonImage: {
        width: 80,
        height: 80,
        backgroundColor: '#d1d1d1',
        borderRadius: 8,
    },
});

export default CourseListForLarge;
