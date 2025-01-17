import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";
import { useNavigation, StackActions } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for secure storage

const getUser = async () => {
  const user = await SecureStore.getItemAsync('userData');
  return user;
}

const Splash = () => {
  const navigation = useNavigation(); // Pour rediriger après le splash screen
  const [user, setUser] = React.useState(null); // État pour stocker l'utilisateur

  // Animation de scale 
  const scale = useSharedValue(1);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser(); // Attendre la résolution de la promesse
      setUser(userData as any); // Mettre à jour l'état avec les données utilisateur
    };

    fetchUser(); // Appeler la fonction pour récupérer l'utilisateur



    // Timeout pour passer à l'écran suivant (par exemple, "Home") après 3 secondes
    const timeout = setTimeout(() => {
      if (user) {
        navigation.dispatch(StackActions.replace("Home")); // Utiliser StackActions.replace pour remplacer l'écran
      } else {
        navigation.dispatch(StackActions.replace("Auth")); // Utiliser StackActions.replace pour remplacer l'écran
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [user]); // Ajouter user comme dépendance


  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../../assets/images/logos/lt-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D1E4FF",
  },
  logo: {
    width: 190,
  },
});

export default Splash;
