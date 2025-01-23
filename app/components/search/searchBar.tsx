import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, ToastAndroid } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import RoundedTopContainer from "../utils/custumFormSheet";
import { apiRequest } from "../../../utils/api";

const SearchBar = ({ onSearch }: { onSearch: (query: string, category: string | null, level: string | null) => void }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isFilted, setIsFilted] = useState(false);
  const [categoryList, setCategoryList] = useState<string[]>([]);

  const levelList = ["Débutant", "Intermédiaire", "Avancé"];

  const openOptionsModal = () => {
    setIsOptionsModalVisible(true);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest({
          method: "GET", 
          url: "/courses/categories", 
      });
        setCategoryList(res.data.map((category: any) => category.name));
      } catch (err) {
        ToastAndroid.show("Une erreur s'est produite", ToastAndroid.SHORT)
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = () => {
    onSearch(query, category, level);
    if (category || level) {
      setIsFilted(true);
    }
    setIsOptionsModalVisible(false);
  }

  const removeCategory = () => {
    setCategory(null);
    setTimeout(() => {
      handleSubmit();
    }, 100);
  }

  const removeLevel = () => {
    setLevel(null);
    setTimeout(() => {
      handleSubmit();
    }, 100);
  }
  return (
    <>
      <View style={styles.container}>
        <Ionicons name="search-outline" size={24} color="#AFAFAF" style={styles.icon} />
        <TextInput
          placeholder="Trouver des emplois ou des profils"
          style={styles.input}
          placeholderTextColor="#AFAFAF"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          keyboardType="web-search"
        />
        <TouchableOpacity
          onPress={openOptionsModal}
          activeOpacity={0.8}
          style={isFilted ? styles.filtedBtn : {}}
        >
          <Ionicons
            name="options-outline"
            size={24}
            color={isFilted ? "#fff" : "#AFAFAF"}
            style={isFilted ? styles.filtedIcon : styles.icon}
          />
        </TouchableOpacity>
      </View>

      {isFilted && (
        <View style={styles.filterContainer}>

          {category && (
            <View style={styles.filter}>
              <Text style={styles.filterText}>{category}</Text>
              <TouchableOpacity onPress={removeCategory}>
                <Ionicons name="close-outline" size={20} color="#252525" />
              </TouchableOpacity>
            </View>
          )}

          {level && (
            <View style={styles.filter}>
              <Text style={styles.filterText}>{level}</Text>
              <TouchableOpacity onPress={removeLevel}>
                <Ionicons name="close-outline" size={20} color="#252525" />
              </TouchableOpacity>
            </View>
          )}
  
        </View>
      )}

      {isOptionsModalVisible && (
        <RoundedTopContainer onClose={() => setIsOptionsModalVisible(false)}>
          <Text style={styles.modalTitle}>Définir des filtres</Text>
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Catégories</Text>
            <View style={styles.pickerWithIcon}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
              >
                <Picker.Item key={0} label="Toutes les catégories" value={null} />
                {categoryList.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
            <Text style={styles.filterSectionTitle}>Niveau</Text>
            <View style={styles.pickerWithIcon}>
              <Picker
                selectedValue={level}
                onValueChange={(itemValue) => setLevel(itemValue)}
                style={styles.picker}
              >
                <Picker.Item key={0} label="Toutes les niveaux" value={null} />
                {levelList.map((level, index) => (
                  <Picker.Item key={index} label={level} value={level} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.applyButton} onPress={handleSubmit}>
              <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
            </TouchableOpacity>
          </View>
        </RoundedTopContainer>
      )}
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  filtedBtn: {
    backgroundColor: "#0056D2",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  filtedIcon: {
    margin: 10,
    color: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#BEBEBE",
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10,
    gap: 10,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9E9E999",
    borderRadius: 10,
    padding: 5,
  },
  filterText: {
    marginRight: 10,
    color: "#252525",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  filterSection: {
    marginVertical: 10,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 20,
  },
  pickerWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: "#FFF",
    // width: "95%",
    marginBottom: 10,
  },
  
  
  pickerWithIconInput: {
    flex: 1,
  },
  
  locationSalaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  locationContainer: {
    // flex: 1,
    width: "49%",
  },
  salaryContainer: {
    // flex: 1,
    width: "49%",
  },
  jobTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  jobTypeButton: {
    backgroundColor: "#E9E9E999",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  jobTypeButtonText: {
    color: "#252525",
    fontWeight: "400",
    textAlign: "center",
  },
  jobTypeButtonActive: {
    backgroundColor: "#DF780D",
    borderRadius: 10,
    padding: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  jobTypeButtonTextActive: {
    color: "#fff",
    fontWeight: "400",
    textAlign: "center",
  },
  applyButton: {
    backgroundColor: "#0056D2",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  picker: {
    width: '100%',
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
export default SearchBar;
