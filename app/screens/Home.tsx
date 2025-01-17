import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Background from "../components/utils/background";
import NavBar from "../components/utils/navBar";
import Header from "../components/utils/header";
import PathwayList from "../components/pathway/list";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import CourseListForLarge from "../components/course/listForLarge";
import BackDisabled from "../components/utils/backDisabled";
import CategoryList from "../components/utils/categoryList";

const Home = () => {

  return (
    <>
      <Background />
      <BackDisabled />
      <Header title="Explorer" />
      <ScrollView style={styles.container}>
        <View>
          <View style={styles.containerHeader}>
            <MaterialIcons name="category" size={26} color="black" />
            <Text style={styles.title}>Catégories</Text>
          </View>
          <CategoryList />
        </View>
        <View>
          <View style={styles.containerHeader}>
            <AntDesign name="star" size={26} color="black" />
            <Text style={styles.title}>Nos parcours</Text>
          </View>
          <PathwayList />
        </View>
        <View>
          <View style={styles.containerHeader}>
            <AntDesign name="like1" size={26} color="black" />
            <Text style={styles.title}>Les cours recommandés</Text>
          </View>
          <CourseListForLarge />
        </View>
      </ScrollView>
      <NavBar active="home" />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    marginBottom: 100,
  },
  containerHeader: {
    flexDirection: 'row',
    marginBottom: 1,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
export default Home;
