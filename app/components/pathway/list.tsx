import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import PathwayMiniCard from "./miniCard";
import { useNavigation } from "@react-navigation/native";
import { Pathway } from "../../../utils/types";
import { apiRequest } from "../../../utils/api";

const PathwayList = () => {
    const [pathways, setPathways] = useState<Pathway[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPathways = async () => {
            try {
                const response = await apiRequest({ method: 'GET', url: "courses/pathways/" });
                setPathways(response.data.results);
            } catch (err) {
                setError("Failed to load pathways: " + err);
            } finally {
                setLoading(false);
            }
        };

        fetchPathways();
    }, []);

    if (loading) {
        // Skeleton screen
        return (
            <View style={styles.container}>
                {Array.from({ length: 7 }).map((_, index) => (
                    <View key={index} style={styles.skeletonCard}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonInfo}>
                        <View style={styles.skeletonText} />
                        <View style={styles.skeletonTitle} />
                        <View style={[styles.skeletonText, {marginTop: 5, width: '95%'}]} />
                        <View style={[styles.skeletonText, {width: '90%'}]} />
                        <View style={[styles.skeletonText, {width: '85%'}]} />
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.container}>
            {pathways.map(pathway => (
                <PathwayMiniCard 
                    key={pathway.id}
                    id={pathway.id.toString()}
                    title={pathway.title} 
                    description={pathway.short_description}
                    category={pathway.category} 
                    image={pathway.image} 
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        flexDirection: 'row',
    },
    // Skeleton styles
    skeletonCard: {
        width: 175,
        height: 200,
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
        height: 7,
        backgroundColor: '#d1d1d1',
        borderRadius: 5,
        marginBottom: 5,
    },

});

export default PathwayList;
