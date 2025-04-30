import React, { useState } from 'react';
import {Pressable, Text, View} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { useQuery } from '@tanstack/react-query';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { fetchGet } from '../../util/api';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useTablet from '../../hooks/useTablet';

type ExamScreenProps = NativeStackScreenProps<HomeStackParamList, 'Exam'>;

interface ExamDate {
  year: string;
  session: string;
}

function ExamScreen({ route }: ExamScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  // const isTablet = useTablet();
  const {theme} = useThemeStore();
  const isTablet = useTablet();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, isTablet, insets);
  const { certificationId, subjectId, subjectName } = route.params;
  const [isFocus, setIsFocus] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const { data: examDate } = useQuery({
    queryKey: ['examDate', certificationId],
    queryFn: async () => {
      return await fetchGet<ExamDate[]>(`exam/certification/${certificationId}/year-session`);
    },
    enabled: !!certificationId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 드롭다운 옵션 변환 함수
  const getDropdownOptions = (examDate?: ExamDate[]) => {
    if (!examDate) {return [];}
    return examDate.map(item => ({
      label: `${item.year}년 ${item.session}회차`,
      value: `${item.year}-${item.session}`,
    }));
  };

  const handleExamPress = () => {
    if (selectedValue) {
      const [yearStr, sessionStr] = selectedValue.split('-');
      const yearNum = Number(yearStr);
      const sessionNum = Number(sessionStr);

      // 변환 성공 여부 확인 (NaN 체크는 여전히 유효)
      if (!isNaN(yearNum) && !isNaN(sessionNum)) {
        navigation.navigate('QuestionPager', {
          subjectId: subjectId,
          subjectName: subjectName,
          certificationId: certificationId,
          mode: 'exam',
          year: yearNum,
          session: sessionNum,
        });
      } else {
        console.error('Failed to parse year or session from selected value:', selectedValue);
      }
    } else {
      console.log('Please select an exam session.');
    }
  };

  console.log(selectedValue);

  return (
    <View style={[styles.container, {
           paddingTop: insets.top,
           paddingLeft: insets.left,
           paddingRight: insets.right,
         }]}>
      <View style={styles.contentContainer}>
        <View style={styles.headerButtonContainer}>
          <Pressable onPress={handleGoBack}>
            <MaterialIcons name="arrow-back-ios" style={styles.icon} />
          </Pressable>
        </View>
        <Dropdown
            style={[styles.dropdown, isFocus ? { borderColor: colors[theme].MAIN} : {}]}
            data={getDropdownOptions(examDate)}
            maxHeight={300}
            labelField="label"
            valueField="value"
            containerStyle={styles.containerStyle}
            activeColor={colors[theme].GRAY_200}
            itemTextStyle={{ color: colors[theme].BLACK }}
            placeholder={'시험년도 선택'}
            placeholderStyle={styles.placeholderStyle}
            value={selectedValue}
            selectedTextStyle={styles.selectedTextStyle}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setSelectedValue(item.value);
              setIsFocus(false);
            }}
        />
        <Pressable
          style={[
            styles.button,
            selectedValue === null && { backgroundColor: colors[theme].GRAY_300 },
          ]}
          onPress={handleExamPress}
          disabled={selectedValue === null}
        >
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styling = (theme: themeMode, isTablet: boolean, insets: EdgeInsets) => ScaledSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors[theme].WHITE,
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButtonContainer: {
    width: '100%',
    height: '40@mvs',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors[theme].GRAY_300,
  },
  icon: {
    color: colors[theme].MAIN,
    fontSize: '24@mvs0.3',
    paddingLeft: '14@ms',
  },
  dropdown: {
    height: '50@mvs',
    width: '90%',
    maxWidth: '600@ms',
    borderColor: colors[theme].GRAY_300,
    borderWidth: 0.5,
    borderRadius: '8@ms',
    paddingHorizontal: '16@ms',
    marginBottom: '16@mvs',
  },
  containerStyle: {
    backgroundColor: colors[theme].WHITE,
    borderColor: colors[theme].GRAY_300,
    borderWidth: 0.5,
    borderRadius: '8@ms',
  },
  placeholderStyle: {
    color: colors[theme].BLACK,
  },
  selectedTextStyle: {
    color: colors[theme].BLACK,
  },
  button: {
    width: '100%',
    maxWidth: '600@ms',
    height: !isTablet && insets.bottom > 0 ? '90@ms' : '80@ms',
    backgroundColor: colors[theme].MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors[theme].UNCHANGE_WHITE,
    fontSize: '20@ms',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ExamScreen;
