import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import CourseLargeCard from "../course/largeCard";
import { apiRequest } from "../../../utils/api";
import { Course } from "../../../utils/types";
import { API_URL } from "../../../env";

const CoursesSearch = ({ query, category, level }: { query: string | ''; category: string | null; level: string | null }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest({
          method: "GET",
          url: `/courses/courses/search/?query=${query}&category=${category ?? ""}&level=${level ?? ""}`,
        });
        setCourses(response.data.results);
      } catch {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    if (query || category || level) fetchCourses();
  }, [query, category, level]);

  if (loading) return <ActivityIndicator size="large" color="#007bff" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <>
        <Text style={styles.resultsText}> {courses.length} Cours trouvé{courses.length > 1 ? "s" : ""}</Text>
        <ScrollView style={styles.scrollContainer}>
            {courses.length > 0 ? (
                courses.map((course) => (
                <CourseLargeCard
                    key={course.id}
                    id={course.id.toString()}
                    title={course.title}
                    category={course.category}
                    imageUrl={API_URL + course.image ?? ""}
                    level={course.level ?? ""}
                />
                ))
                ) : (
                    <Text style={styles.noResultsText}>Aucun cours trouvé.</Text>
                )}
        </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  errorText: { color: "red", textAlign: "center", marginVertical: 10 },
  noResultsText: { textAlign: "center", marginVertical: 10 },
  resultsText: { fontSize: 14, fontWeight: "bold", marginVertical: 10, marginLeft: 10 },
});

export default CoursesSearch;
