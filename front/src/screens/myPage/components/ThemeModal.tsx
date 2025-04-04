import React from 'react';
import {View, Modal, Text, Pressable, TouchableWithoutFeedback  } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import useThemeStore, { themeMode } from '../../../store/useThemeStore';
import { colors } from '../../../constants/colors';
import useThemeStorage from '../../../hooks/useThemeStorage';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
interface ThemeModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
}

function ThemeModal({isModalVisible, setIsModalVisible}: ThemeModalProps) {
  const { theme } = useThemeStore();
  const { setMode, setSystem } = useThemeStorage();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);

  const onClose = () => {
    setIsModalVisible(false);
  };

  const onLight = () => {
    setMode('light');
    setSystem(false);
    setIsModalVisible(false);
  };

  const onDark = () => {
    setMode('dark');
    setSystem(false);
    setIsModalVisible(false);
  };

  const onSystem = () => {
    setSystem(true);
    setIsModalVisible(false);
  };

  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        supportedOrientations={['portrait', 'landscape', 'portrait-upside-down', 'landscape-left', 'landscape-right']}
      >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.themeButtonContainer}>
              <Pressable onPress={onLight} style={styles.themeButton}>
                <Text style={styles.themeButtonText}>라이트 모드</Text>
              </Pressable>
              <Pressable onPress={onDark} style={styles.themeButton}>
                <Text style={styles.themeButtonText}>다크 모드</Text>
              </Pressable>
              <Pressable onPress={onSystem} style={styles.themeButton}>
                <Text style={styles.themeButtonText}>시스템 모드</Text>
              </Pressable>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      </Modal>
  );
}

const styling = (theme: themeMode, insets: EdgeInsets) => ScaledSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // 모달이 화면 아래에서 시작
  },
  modalContainer: {
    minHeight: '30%',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors[theme].GRAY_300,
    backgroundColor: colors[theme].WHITE,
    transform: [{ rotate: '0deg' }], // 회전 방지
    paddingTop: '8@mvs',
    paddingBottom: insets.bottom,
  },
  themeButtonContainer: {
    width: '100%',
    marginTop: '20@mvs',
    alignItems: 'center',
  },
  themeButton: {
    width: '80%',
    maxWidth: '600@mvs',
    height: '50@mvs',
    backgroundColor: colors[theme].WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors[theme].GRAY_300,
    marginBottom: '12@mvs',
    justifyContent: 'center',
  },
  themeButtonText: {
    fontSize: '20@mvs0.2',
    fontWeight: 'bold',
    color: colors[theme].MAIN,
    textAlign: 'center',
  },
});

export default ThemeModal;
