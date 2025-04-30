import React from 'react';
import {View, Modal, Text, Pressable, TouchableWithoutFeedback} from 'react-native';
import { themeMode } from '../../store/useThemeStore';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore from '../../store/useThemeStore';
import { colors } from '../../constants/colors';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  handleExamCompleted: () => void;
}

function SubmitExamModal({ isVisible, onClose, handleExamCompleted }: Props) {
  const { theme } = useThemeStore();
  const styles = styling(theme);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      supportedOrientations={['portrait', 'landscape', 'portrait-upside-down', 'landscape-left', 'landscape-right']}
    >
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>시험을 완료하시겠습니까?</Text>
              <View style={styles.modalButtonRow}>
                <Pressable
                  onPress={() => onClose()}
                  style={[styles.modalButton, styles.modalButtonNo]}
                >
                  <Text style={styles.modalButtonText}>아니오</Text>
                </Pressable>
                <Pressable
                  onPress={handleExamCompleted}
                  style={[styles.modalButton, styles.modalButtonYes]}
                >
                  <Text style={styles.modalButtonText}>예</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styling = (theme: themeMode) => ScaledSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      minHeight: '24%',
      width: '80%',
      maxWidth: '280@ms',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors[theme].WHITE,
      transform: [{ rotate: '0deg' }], // 회전 방지
    },
    modalTitle: {
      fontSize: '20@ms0.2',
      color: colors[theme].BLACK,
      marginBottom: '16@mvs',
    },
    modalButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: '16@mvs',
    },
    modalButton: {
      width: '80@ms',
      padding: '12@mvs',
      borderRadius: '8@mvs',
      marginHorizontal: '6@ms',
    },
    modalButtonNo: {
      backgroundColor: colors[theme].GRAY_300,
    },
    modalButtonYes: {
      backgroundColor: colors[theme].MAIN,
    },
    modalButtonText: {
      color: colors[theme].WHITE,
      fontSize: '16@ms0.2',
      textAlign: 'center',
    },
  });

  export default SubmitExamModal;
