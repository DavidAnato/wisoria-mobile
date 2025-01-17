import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store'; // Import SecureStore
import Background from "../../components/utils/background";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { apiRequest } from "../../../utils/api"; // Import apiRequest

const SignUp = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({}); // Permettre undefined
  const [loading, setLoading] = useState(false); // State for loading

  const isFormValid = firstName && lastName && email && password;

  const handleSignUp = async () => {
    try {
      if (!isFormValid) {
        setErrors({ general: "Tous les champs sont obligatoires." });
        return;
      }

      setLoading(true); // Start loading
      const response = await apiRequest({
        method: "POST",
        url: "users/register/",
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        },
      });

      if (!response.status.toString().startsWith('2')) {
        throw new Error(response.status.toString());
      }

      // Store email and password in SecureStore
      await SecureStore.setItemAsync('email', email);
      await SecureStore.setItemAsync('password', password);

      // Réinitialiser les erreurs
      setErrors({});

      navigation.navigate("EmailActivateConfirm" as never);
    } catch (error: any) {
      // Gérer les erreurs spécifiques
      if (error.response?.data) {
        setErrors(error.response.data); // Stocker les erreurs dans l'état
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleInputFocus = (field: string) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined })); // Efface l'erreur pour le champ en cours
  };

  return (
    <View style={styles.container}>
      <Background />
      <Image
        source={require("../../../assets/images/logos/lt-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
      {errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
      <View style={styles.inputContainer}>
        <Feather name="user" size={24} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          autoCapitalize="none"
          value={firstName}
          onChangeText={setFirstName}
          keyboardType="default"
          onFocus={() => handleInputFocus('first_name')}
        />
      </View>
      {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
      <View style={styles.inputContainer}>
        <Feather name="user" size={24} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          autoCapitalize="none"
          value={lastName}
          onChangeText={setLastName}
          keyboardType="default"
          onFocus={() => handleInputFocus('last_name')}
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <View style={styles.inputContainer}>
        <Feather name="mail" size={24} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onFocus={() => handleInputFocus('email')}
        />
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <View style={styles.inputContainer}>
        <Feather name="lock" size={24} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword} // Toggle password visibility
          value={password}
          onChangeText={setPassword}
          keyboardType="default"
          onFocus={() => handleInputFocus('password')}
        />
        < TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.8}
        >
          <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.button, { opacity: isFormValid ? 1 : 0.5 }]}
        onPress={handleSignUp}
        disabled={!isFormValid || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <AntDesign name="adduser" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>S'inscrire</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.link}
        onPress={() => navigation.navigate("Login" as never)}
        activeOpacity={0.8}
      >
        <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={require("../../../assets/images/icons/google.png")} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: "#0056D2",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
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
  link: {
    alignItems: "center",
  },
  linkText: {
    color: "#0056D2",
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
  },
  errorText: {
    color: "red", // Couleur rouge pour les messages d'erreur
    fontSize: 12,
    marginTop: 5,
  },
});

export default SignUp;
