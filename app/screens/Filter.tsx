import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import SearchBar from "../components/search/searchBar";
import CoursesSearch from "../components/search/coursesSearch";
import PathwaysSearch from "../components/search/pathwaysSearch";
import Header from "../components/utils/header";
import Background from "../components/utils/background";

const Filter = ({ route }: { route: any }) => {
  const { category } = route.params;
  const [tab, setTab] = useState<string>("courses");

  const handleChangeTab = (tab: string) => {
    setTab(tab);
  };

  return (
    <>
        <Background />
        <View style={styles.container}>
        <Header title={category.name} profileEnabled={false} backEnabled={true}/>
        <View style={styles.categoryContainer}>
          <Image source={{ uri: category.image }} style={styles.categoryImage} />
          <Text style={styles.descriptionText}>{category.description}</Text>
        </View>
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tabButton, tab === "courses" && styles.activeTab, { borderBottomColor: category.color }]}
                onPress={() => handleChangeTab("courses")}
            >
            <Text style={styles.tabText}>Cours</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tabButton, tab === "pathways" && styles.activeTab, { borderBottomColor: category.color }]}
                onPress={() => handleChangeTab("pathways")}
            >
            <Text style={styles.tabText}>Parcours</Text>
            </TouchableOpacity>
        </View>
        {tab === "courses" ? (
            <CoursesSearch category={category.name} query={""} level={null}/>
        ) : (
            <PathwaysSearch category={category.name} query={""} level={null}/>
        )}
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Rend l'image circulaire
    marginRight: 10, // Ajoute un espacement entre l'image et le texte
  },
  descriptionText: {
    fontSize: 16,
    color: "#777",
    flex: 1, // Permet au texte d'occuper l'espace restant
    flexWrap: "wrap", // Permet au texte de passer à la ligne si nécessaire
  },
  tabContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tabButton: {
    padding: 10,
    width: "50%",
  },
  tabText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  activeTab: {
    borderBottomColor: "#F4A002",
    borderBottomWidth: 2,
  },
});

export default Filter;
