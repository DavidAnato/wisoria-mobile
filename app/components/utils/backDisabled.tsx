import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, ToastAndroid } from "react-native";
import React, { useCallback, useState } from "react";

export default function BackDisabled() {
    const [backPressedOnce, setBackPressedOnce] = useState(false);

    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            if (backPressedOnce) {
              BackHandler.exitApp();
            } else {
              setBackPressedOnce(true);
              ToastAndroid.show("Faites retour à nouveau pour quitter", ToastAndroid.SHORT);
    
              // Réinitialiser après 2 secondes
              setTimeout(() => {
                setBackPressedOnce(false);
              }, 2000);
            }
            return true; // Empêche le retour par défaut
          };
    
          BackHandler.addEventListener("hardwareBackPress", onBackPress);
    
          return () => {
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
          };
        }, [backPressedOnce])
      );

    return null;
}