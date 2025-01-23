import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { apiRequest } from "../../utils/api";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CoursesHeader from "../components/utils/coursesHeader";
import LessonsDrawer from "../components/course/lessonsDrawer";

const Quiz = ({ route }: { route: any }) => {
  const { quizId, currentChapterId, courseId } = route.params;
  const navigation = useNavigation();
  const [quiz, setQuiz] = useState<any>(null);
  const [responses, setResponses] = useState<any>({});
  const [quizStatus, setQuizStatus] = useState<any>(null);
  const [quizGlobalStatus, setQuizGlobalStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = async () => {
    try {
      // Vérification si l'utilisateur a déjà fait le quiz
      const checkResponse = await apiRequest({
        url: `quiz/check/${quizId}/`,
        method: "GET",
      });

      if (checkResponse.data) {
        // L'utilisateur a déjà répondu, initialiser les états
        const updatedResponses = checkResponse.data.quiz_responses.map((response: any) => ({
          ...response,
          status: response.is_correct ? "success" : "failure",
        }));

        const overallSuccess = checkResponse.data.result.success ? "success" : "failure";

        setQuizGlobalStatus(true);
        setQuizStatus({
          responses: updatedResponses,
          overall: overallSuccess,
          result: checkResponse.data.result,
        });
      }

      // Récupérer les informations du quiz
      const quizResponse = await apiRequest({
        url: `quiz/get/${quizId}/`,
        method: "GET",
      });
      setQuiz(quizResponse.data);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev: any) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    const formattedResponses = Object.entries(responses).map(([questionId, value]) => {
      const isArray = Array.isArray(value);
      return {
        question: parseInt(questionId),
        selected_options: isArray ? value : value !== null ? [value] : [],
      };
    });

    try {
      const response = await apiRequest({
        url: `quiz/submit/${quizId}/`,
        method: "POST",
        data: { responses: formattedResponses },
      });

      const updatedResponses = response.data.quiz_responses.map((response: any) => ({
        ...response,
        status: response.is_correct ? "success" : "failure",
      }));

      const overallSuccess = response.data.result.success ? "success" : "failure";

      setQuizGlobalStatus(true);
      setQuizStatus({
        responses: updatedResponses,
        overall: overallSuccess,
        result: response.data.result,
      });
    } catch (err: any) {
      ToastAndroid.show("Erreur lors de la soumission.", ToastAndroid.SHORT)
      setError(err.response?.data || "Erreur lors de la soumission.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <>
      { isSideBarOpen && (
        <LessonsDrawer onClose={() => {setIsSideBarOpen(false)}} courseId={courseId} />
      )}
      <CoursesHeader title="Quiz" backEnabled={true} onMenuPress={() => {setIsSideBarOpen(true)}} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{quiz.title}</Text>
        <Text style={styles.description}>{quiz.description}</Text>

        {quiz.questions.map((question: any) => {
          const questionStatus = quizStatus?.responses?.find((response: any) => response.question === question.id)?.status;

          return (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question.text}</Text>
              {question.question_type === "select" && (
                <Text style={styles.multipleChoiceMessage}>Vous pouvez sélectionner plusieurs options.</Text>
              )}

              {question.question_type === "radio" &&
                question.options.map((option: any) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      responses[question.id] === option.id && styles.optionSelected,
                    ]}
                    onPress={() => handleResponseChange(question.id, option.id)}
                  >
                    <Text>{option.text}</Text>
                  </TouchableOpacity>
                ))}

              {question.question_type === "select" &&
                question.options.map((option: any) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      responses[question.id]?.includes(option.id) && styles.optionSelected,
                    ]}
                    onPress={() => {
                      const selected = responses[question.id] || [];
                      if (selected.includes(option.id)) {
                        handleResponseChange(
                          question.id,
                          selected.filter((id: any) => id !== option.id)
                        );
                      } else {
                        handleResponseChange(question.id, [...selected, option.id]);
                      }
                    }}
                  >
                    <Text>{option.text}</Text>
                  </TouchableOpacity>
                ))}

              {questionStatus === "success" && <Text style={styles.successText}>Réussi !</Text>}
              {questionStatus === "failure" && <Text style={styles.failureText}>Raté !</Text>}
            </View>
          );
        })}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <MaterialIcons name="done" size={24} color="white" />
          <Text style={styles.submitButtonText}>Soumettre</Text>
        </TouchableOpacity>
      </ScrollView>

      {quizStatus && quizGlobalStatus && (
        <View style={styles.quizResultBackground}>
          <View style={styles.quizResultContainer}>
            <Text
              style={quizStatus.overall === "success" ? styles.successText : styles.failureText}
            >
              {quizStatus.overall === "success" ? "Quiz réussi ! 🎉" : "Quiz échoué ! ❌"}
            </Text>
            <Text style={styles.scoreText}>
              Score : {quizStatus.result.score} / {quiz.questions.length}
            </Text>
            <Text style={styles.scoreText}>
              Pourcentage : {quizStatus.result.percentage.toFixed(2)}%
            </Text>
            <View style={styles.reloadNextContainer}>
            {quizStatus.overall === 'success' ?
              <>
                <TouchableOpacity style={styles.reloadButton} onPress={() => {setQuizGlobalStatus(false)}}>
                <MaterialIcons name="repeat" size={24} color="#0056D2" />
                <Text style={styles.reloadButtonText}>
                    Refaire
                </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={() => {navigation.navigate('Course', { courseId: courseId, currentChapterId: currentChapterId })}}>
                <Text style={styles.nextButtonText}>
                    Suivant
                </Text>
                <MaterialIcons name="navigate-next" size={30} color="#fff" />
                </TouchableOpacity>
              </>
                :
                <TouchableOpacity style={styles.nextButton} onPress={() => {setQuizGlobalStatus(false)}}>
                <MaterialIcons name="repeat" size={24} color="#FFF" />
                <Text style={styles.nextButtonText}>
                    Réessayer
                </Text>
                </TouchableOpacity>
              }
            </View>

          </View>
        </View>
      )}
    </>
  );
};

// export default Quiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  multipleChoiceMessage: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  optionButton: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  optionSelected: {
    backgroundColor: "#cce5ff",
  },
  successText: {
    color: 'green',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  failureText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  quizResultBackground: {
    backgroundColor: "#0009",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  quizResultContainer: {
    alignItems: 'center',
    borderRadius: 15,
    padding: 20,
    backgroundColor: "#f0f0f0",
    position: "absolute",
    top: 300,
    left: 0,
    right: 0,
    margin: 50,
  },
  scoreText: {
    fontSize: 16,
    color: "#000",
  },
  reloadNextContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  reloadButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0056D2",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  reloadButtonText: {
    color: "#0056D2",
    fontWeight: "bold",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#0056D2",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#0056D2",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginBottom: 40,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Quiz;
