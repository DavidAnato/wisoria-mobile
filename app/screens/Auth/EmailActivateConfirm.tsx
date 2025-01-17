import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Background from '../../components/utils/background';
import * as SecureStore from 'expo-secure-store'; // Import SecureStore for secure storage
import { apiRequest } from '../../../utils/api';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation

const EmailActivateConfirm = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [code, setCode] = useState(['', '', '', '', '']);
  const [email, setEmail] = useState(''); // Add email to component state
  const [loading, setLoading] = useState(false); // Add loading state
  const inputRefs = useRef<(TextInput | null)[]>([]); // Create a ref to store input references

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await SecureStore.getItemAsync('email'); // Retrieve email from SecureStore
      if (storedEmail) {
        setEmail(storedEmail); // Set email in component state
      }
    };
    fetchEmail();
  }, []);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Automatically focus on the next input if the current one is filled
    if (text && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus(); // Focus the next input
    }
  };

  const handleKeyPress = (index: number, event: any) => {
    // If the current input is empty and it's not the last input, focus on the next input
    if (event.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
        inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    const password = await SecureStore.getItemAsync('password'); // Retrieve password from SecureStore

    if (email && password) {
      setLoading(true); // Set loading to true
      try {
        const response = await apiRequest({
          method: 'POST',
          url: 'users/email/activate/confirm/',
          data: {
            otp_code: fullCode,
            email: email,
          },
        });

        if (response.status === 200) {
          // If activation is successful, log in the user
          const loginResponse = await apiRequest({
            method: 'POST',
            url: 'users/login/',
            data: {
              email: email,
              password: password,
            },
          });

          if (loginResponse.status === 200) {
            // Store tokens and user data in SecureStore
            const data = await loginResponse.data;
            await SecureStore.setItemAsync('refreshToken', data.refresh);
            await SecureStore.setItemAsync('accessToken', data.access);
            await SecureStore.setItemAsync('userData', JSON.stringify(data.user));

            Alert.alert('Success', 'You have successfully activated your account and logged in!');
            navigation.navigate("Home" as never); // Redirect to Home screen
          } else {
            Alert.alert('Error', 'Login failed after activation. Please try again.');
          }
        } else {
          Alert.alert('Error', 'Activation failed. Please check your code and try again.');
        }
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false); // Set loading to false
      }
    } else {
      Alert.alert('Error', 'Email or password not found. Please try again.');
    }
  };

  const handleResendCode = async () => {
    setLoading(true); // Set loading to true
    try {
      const response = await apiRequest({
        method: 'POST',
        url: 'users/email/activate/request/',
        data: {
          email: email,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'A new activation code has been sent to your email.');
      } else {
        Alert.alert('Error', 'Failed to resend the activation code. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const isButtonDisabled = code.some(digit => digit === ''); // Check if any input is empty

  return (
    <View style={styles.container}>
      <Background />
      <Text style={styles.message}>Nous envoyons un e-mail à l'adresse <Text style={styles.email}>{email}</Text>. Assurez-vous de saisir correctement le code à 5 chiffres.</Text>
      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)} // Assign ref to each input
            style={styles.input}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(index, event)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>
      {loading ? ( // Show loading indicator
        <ActivityIndicator size="large" color="#0056D2" />
      ) : (
        <>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit} 
            disabled={isButtonDisabled}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.resendButton} 
            onPress={handleResendCode}
            activeOpacity={0.8}
          >
            <Text style={styles.resendText}>Renvoie le code</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  email: {
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    height: 70,
    width: '18%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0056D2',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  resendButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  resendText: {
    color: '#0056D2',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default EmailActivateConfirm;
