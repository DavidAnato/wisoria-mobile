import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import SearchBar from "../components/search/searchBar";
import CoursesSearch from "../components/search/coursesSearch";
import PathwaysSearch from "../components/search/pathwaysSearch";
import Header from "../components/utils/header";
import Background from "../components/utils/background";
import NavBar from "../components/utils/navBar";
const Search = () => {
  const [tab, setTab] = useState<string>("courses");
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);


  const handleSearch = (query: string, category: string | null, level: string | null) => {
    setQuery(query);
    setCategory(category);
    setLevel(level);
  };

  const handleChangeTab = (tab: string) => {
    setTab(tab);
  };

  return (
    <>
        <Background />
        <NavBar active="search" />
        <Header title="Recherche" backEnabled={true}/>
        <View style={styles.container}>
        <SearchBar onSearch={handleSearch} />
        <View style={styles.tabContainer}>
            <TouchableOpacity
                style={[styles.tabButton, tab === "courses" && styles.activeTab]}
                onPress={() => handleChangeTab("courses")}
            >
            <Text style={styles.tabText}>Cours</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tabButton, tab === "pathways" && styles.activeTab]}
                onPress={() => handleChangeTab("pathways")}
            >
            <Text style={styles.tabText}>Parcours</Text>
            </TouchableOpacity>
        </View>
        {tab === "courses" ? (
            <CoursesSearch query={query} category={category} level={level} />
        ) : (
            <PathwaysSearch query={query} category={category} level={level} />
        )}
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 100,
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

export default Search;
