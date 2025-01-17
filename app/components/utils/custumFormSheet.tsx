import React, { useRef } from "react";
import { View, StyleSheet, PanResponder, Animated, TouchableWithoutFeedback, Modal } from "react-native";

type RoundedTopContainerProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const RoundedTopContainer = ({ onClose, children }: RoundedTopContainerProps) => {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
    animationType="fade"
    transparent={true}
    visible={true}
    onRequestClose={onClose}
  >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.background}>
          <Animated.View
            style={[
              styles.container,
              { transform: [{ translateY }] },
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.bar} />
            <View style={styles.content}>
              {children}
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    height: "200%",
    backgroundColor: "#0005",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100000,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 300,
    backgroundColor: "#F0F0F0",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
    alignItems: "center",
  },
  bar: {
    height: 5,
    width: 100,
    backgroundColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    width: "100%",
  },
});

export default RoundedTopContainer;
