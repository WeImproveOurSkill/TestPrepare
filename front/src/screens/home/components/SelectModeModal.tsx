import React from 'react';
import { Modal, View, Text, Pressable, Platform } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../../store/useThemeStore';
import { colors } from '../../../constants/colors';

type SelectModeModalProps = {
  isVisible: boolean;
  onClose: () => void;
  subjectName: string;
  onStudyPress: () => void;
  onExamPress: () => void;
}

const SelectModeModal = ({
  isVisible,
  onClose,
  subjectName,
  onStudyPress,
  onExamPress,
}: SelectModeModalProps) => {

  const {theme} = useThemeStore();
  const styles = styling(theme);

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
              <Text style={styles.title}>{subjectName}</Text>
            </View>
            <Pressable style={styles.modeContainer} onPress={handleStudyMode}><Text  style={styles.modeButtonText}>공부모드</Text></Pressable>
            <Pressable style={styles.examModeContainer} onPress={handleExamMode}>
              <Text  style={styles.modeButtonText}>시험모드</Text>
            </Pressable>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styling = (theme: themeMode) => ScaledSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: '360@ms',
    maxHeight: '80%',
    minHeight: '200@mvs',
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
    backgroundColor: colors[theme].WHITE,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    padding: '20@mvs',
    borderBottomWidth: 1,
    borderBottomColor: colors[theme].GRAY_200,
  },
  title: {
    fontSize: '20@ms0.2',
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors[theme].GRAY_700,
  },
  modeContainer: {
    padding: '20@mvs',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors[theme].GRAY_200,
  },
  examModeContainer: {
    padding: '20@mvs',
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: '20@ms0.1',
    fontWeight: '400',
    color: colors[theme].GRAY_700,
  },
});

export default SelectModeModal;
