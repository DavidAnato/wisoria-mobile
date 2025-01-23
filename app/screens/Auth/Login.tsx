import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator, ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for secure storage
import Background from "../../components/utils/background";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { apiRequest } from "../../../utils/api";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State for loading

  const handleLogin = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await apiRequest({
        method: 'POST',
        url: 'users/login/',
        data: {
          email: email,
          password: password,
        },
      });

      if (response.status !== 200) {
        ToastAndroid.show("Login failed. Please check your credentials.", ToastAndroid.SHORT);
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.data; // Changed from response.json() to response.data
      // Store the tokens and user data in SecureStore
      await SecureStore.setItemAsync('refreshToken', data.refresh);
      await SecureStore.setItemAsync('accessToken', data.access);
      await SecureStore.setItemAsync('userData', JSON.stringify(data.user));

      ToastAndroid.show(`Welcome back ${data.user.first_name}!`, ToastAndroid.SHORT);
      navigation.navigate("Home" as never);
    } catch (error: any) {
      for (const _ of error.response.data.non_field_errors) {
        ToastAndroid.show(_, ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <View style={styles.container}>
      <Background />
      <Image
        source={require("../../../assets/images/logos/lt-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.inputContainer}>
        <Feather name="mail" size={24} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Feather name="lock" size={24} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword} // Toggle secureTextEntry based on state
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.8}
        >
          <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#000" style={styles.eyeIcon} />
        </TouchableOpacity>
      </View>

      {loading ? ( // Show loading indicator
        <ActivityIndicator size="large" color="#0056D2" />
      ) : (
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <AntDesign name="login" size={24} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.link}
        onPress={() => navigation.navigate("ForgotPassword" as never)}
        activeOpacity={0.8}
      >
        <Text style={styles.linkText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.link}
        onPress={() => navigation.navigate("SignUp" as never)}
        activeOpacity={0.8}
      >
        <Text style={styles.linkText}>Pas encore de compte ? S'inscrire</Text>
      </TouchableOpacity>

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
  eyeIcon: {
    marginLeft: 10,
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
    marginBottom: 10,
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
  }
});

export default Login;
