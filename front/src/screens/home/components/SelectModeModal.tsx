import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';

type SelectModeModalProps = {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  onQuizPress: () => void;
  onStudyPress: () => void;
  onExamPress: () => void;
}

const SelectModeModal = ({
  isVisible,
  onClose,
  title,
  onQuizPress,
  onStudyPress,
  onExamPress,
}: SelectModeModalProps) => {

  const handleQuizMode = () => {
    onClose();
    onQuizPress();
  };

  const handleStudyMode = () => {
    onClose();
    onStudyPress();
  };

  const handleExamMode = () => {
    onClose();
    onExamPress();
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <Pressable style={styles.body} onPress={handleQuizMode}><Text  style={styles.modeButtonText}>퀵퀴즈</Text></Pressable>
            <Pressable style={styles.body} onPress={handleStudyMode}><Text  style={styles.modeButtonText}>공부모드</Text></Pressable>
            <Pressable style={styles.body} onPress={handleExamMode}><Text  style={styles.modeButtonText}>시험모드</Text></Pressable>
            <View style={styles.footer}>
              <Pressable
                style={styles.button}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>닫기</Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 500,
    minHeight: 200,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  body: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  footer: {
    padding: 15,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 20,
    fontWeight: '400',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectModeModal;
