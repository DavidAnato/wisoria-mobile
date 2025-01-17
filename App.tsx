import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './app/screens/Splash';
import Auth from './app/screens/Auth';
import Login from './app/screens/Auth/Login';
import SignUp from './app/screens/Auth/SignUp';
import Home from './app/screens/Home';
import CourseScreen from './app/screens/Course';
import Profile from './app/screens/Profile';
import CourseDetail from './app/components/course/detail';
import Learn from './app/screens/Learn';
import PathwayDetail from './app/components/pathway/detail';
import EmailActivateConfirm from './app/screens/Auth/EmailActivateConfirm';
import Quiz from './app/screens/Quiz';
import Certificate from './app/screens/Certificate';
import * as NavigationBar from 'expo-navigation-bar';
import Search from './app/screens/Search';
import Filter from './app/screens/Filter';

const Stack = createNativeStackNavigator();

export default function App() {
  NavigationBar.setVisibilityAsync('hidden');
  return (
    <NavigationContainer>
      <StatusBar hidden={true} />
      <Stack.Navigator>
        <Stack.Screen 
          name="Splash" 
          component={Splash} 
          options={{ headerShown: false }} 
        />
        {/* Auth start */}
        <Stack.Screen 
          name="Auth" 
          component={Auth} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ 
            title: "", 
            headerStyle: { backgroundColor: '#F4F4F5' }, // No shadow
            headerTransparent: false,
            headerShadowVisible: false // Disable header shadow
          }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ 
            title: "", 
            headerStyle: { backgroundColor: '#F4F4F5' }, // No shadow
            headerTransparent: false,
            headerShadowVisible: false,
          }} 
        />
        <Stack.Screen 
          name="EmailActivateConfirm" 
          component={EmailActivateConfirm} 
          options={{ 
            title: "", 
            headerStyle: { backgroundColor: '#F4F4F5' }, // No shadow
            headerTransparent: false,
            headerShadowVisible: false // Disable header shadow
          }} 
        />
        {/* Auth end */}
        {/* NavBar start */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ 
            title: "Accueil", 
            headerShown: false,
            animation: "fade"
          }} 
        />
        <Stack.Screen 
          name="Learn" 
          component={Learn} 
          options={{ 
            title: "Apprendre", 
            headerShown: false,
            animation: "fade"
          }} 
        />
        <Stack.Screen 
          name="Search" 
          component={Search} 
          options={{ 
            title: "Recherche", 
            headerShown: false,
            animation: "fade"
          }} 
        />
          <Stack.Screen 
            name="Profile" 
            component={Profile} 
            options={{ 
              title: "Profil", 
              headerShown: false,
              animation: "fade"
            }} 
          />
        {/* NavBar end */}
        <Stack.Screen 
          name="Filter" 
          component={Filter} 
          options={{ 
            title: "Filtrer", 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="PathwayDetail" 
          component={PathwayDetail} 
          options={{ 
            title: "Parcours", 
            headerShown: false,
            animation: "slide_from_bottom"
          }} 
        />
        <Stack.Screen 
          name="Course" 
          component={CourseScreen} 
          options={{ 
            title: "Cours", 
            headerShown: false,
            animation: "slide_from_right"
          }} 
        />
        <Stack.Screen 
          name="CourseDetail" 
          component={CourseDetail} 
          options={{ 
            title: "Cours", 
            headerShown: false, 
            animation: "slide_from_bottom"
          }} 
        />
        <Stack.Screen 
          name="Quiz" 
          component={Quiz} 
          options={{ 
            title: "Quiz", 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="Certificate" 
          component={Certificate} 
          options={{ 
            title: "Certificat", 
            headerShown: false,
            animation: "slide_from_bottom"
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

