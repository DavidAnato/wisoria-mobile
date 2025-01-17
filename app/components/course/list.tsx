import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import CourseMiniCard from "./miniCard";
import { useNavigation } from "@react-navigation/native";
import { Course } from "../../../utils/types";
import { apiRequest } from "../../../utils/api";

const CourseList = ({ pathwayId }: { pathwayId?: number }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await apiRequest({ 
                    method: 'GET', 
                    url: `courses/courses/${pathwayId ? `?pathway_id=${pathwayId}` : ''}` 
                });
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
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.container}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <View key={index} style={styles.skeletonCard}>
                        <View style={styles.skeletonImage} />
                        <View style={styles.skeletonInfo}>
                            <View style={[styles.skeletonTitle, { marginTop: 2, width: '80%' }]} />
                            <View style={[styles.skeletonTitle, { width: '70%' }]} />
                            <View style={[styles.skeletonText, { width: '60%' }]} />
                        </View>
                    </View>
                ))}
            </ScrollView>
        );
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                {courses.map(course => (
                    <CourseMiniCard 
                        key={course.id}
                        id={course.id.toString()}
                        title={course.title} 
                        category={course.category} 
                        imageUrl={course.image || ''} 
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
        flexDirection: 'row',
    },
    skeletonCard: {
        width: 200,
        height: 150,
        backgroundColor: '#e3e3e3',
        borderRadius: 10,
        marginRight: 10,
        overflow: 'hidden',
    },
    skeletonInfo: {
        padding: 10,
        justifyContent: 'space-between',
    },
    skeletonImage: {
        width: '100%',
        height: 100,
        backgroundColor: '#d1d1d1',
        borderRadius: 5,
    },
    skeletonTitle: {
        width: '70%',
        height: 20,
        backgroundColor: '#d1d1d1',
        borderRadius: 5,
        marginBottom: 5,
    },
    skeletonText: {
        width: '60%',
        height: 10,
        backgroundColor: '#d1d1d1',
        borderRadius: 5,
        marginBottom: 5,
    },
});

export default CourseList;
