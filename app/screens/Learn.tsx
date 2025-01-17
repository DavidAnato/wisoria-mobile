import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList, ActivityIndicator } from "react-native";
import Background from "../components/utils/background";
import Header from "../components/utils/header";
import NavBar from "../components/utils/navBar";
import MyCourseCard from "../components/course/myCourseCard";
import { apiRequest } from "../../utils/api";
import BackDisabled from "../components/utils/backDisabled";

const Learn = () => {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        const response = await apiRequest({ method: "GET", url: "/learning/user/courses/" });
        setCourses(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    console.log('courses ////////////////',JSON.stringify(courses, null, 2));
    fetchPathways();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0056D2" />;
  }

  if (error) {
    return (
      <>
        <Header title="Learn" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>{error}</Text>
        </View>
        <NavBar active="learn" />
      </>
    );
  }

  return (
    <>
      <Background />
      <BackDisabled />
      <Header title="Mon apprentissage" />
      <NavBar active="learn" />
      <FlatList
        data={courses}
        renderItem={({ item }: { item: any }) => (
          <MyCourseCard
            id={item.course.id}
            title={item.course.title}
            category={item.course.category}
            image={item.course.image}
            progress={item.progress}
            startDate={item.started_at}
            updatedDate={item.updated_at}
            endDate={item.completed_at}
          />
        )}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
});

export default Learn;
