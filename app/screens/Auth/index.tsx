import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Background from "../../components/utils/background";
import AntDesign from '@expo/vector-icons/AntDesign';

const Auth = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Background />
      <Image
        source={require("../../../assets/images/logos/lt-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Image
        source={require("../../../assets/images/illustrations/learning.png")}
        style={styles.learningImage}
        resizeMode="contain"
      />
      <View style={styles.learningTextContainer}>
        <Text style={styles.learningText}>Votre apprentissage, simplifié et accessible</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("SignUp" as never)}
          activeOpacity={0.8}
        >
          <AntDesign name="adduser" size={24} color="#1C2541" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("Login" as never)}
          activeOpacity={0.8}
        >
          <AntDesign name="login" size={24} color="#1C2541" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("EmailActivateConfirm" as never)}
          activeOpacity={0.8}
        >
          <Image source={require("../../../assets/images/icons/google.png")} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("EmailActivateConfirm" as never)}
          activeOpacity={0.8}
        >
          <Image source={require("../../../assets/images/icons/facebook.png")} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 50,
  },
  learningImage: {
    width: 250,
    height: 250,
    alignSelf: "center",
  },
  learningTextContainer: {
    backgroundColor: "orange",
    marginBottom: 30,
    borderRadius: 10,
    padding: 10,
  },
  learningText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    fontStyle: "italic",
    textAlign: "center",
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: "#0056D2",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 10,
    color: "#FFFFFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#808080",
  },
  dividerText: {
    color: "#808080",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialIcon: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  logo: {
    width: 190,
    alignSelf: "center",
    marginBottom: 20,
  }
});

export default Auth;
