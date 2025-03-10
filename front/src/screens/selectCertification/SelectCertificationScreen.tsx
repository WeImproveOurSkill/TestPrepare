// SelectCertification.tsx
import React, { useState } from 'react';
import { TextInput, FlatList, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useQuery } from '@tanstack/react-query';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../navigation/AuthStackNavigator';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { authNavigation } from '../../constants';
import { fetchGet } from '../../util/api';

export interface Certification {
  certificationId: number;
  certificationName: string;
}

type BaseProps = {
  onSelectCertification?: (certification: Certification) => void;
};

type Props = BaseProps & Partial<StackScreenProps<AuthStackParamList, 'SelectCertification'>>;

const SelectCertification = ({ onSelectCertification, navigation }: Props) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCertifications, setSelectedCertifications] = useState<Certification[]>([]);

  // tanstack-query를 사용하여 자격증 목록 가져오기
  const { data: certifications = [], isLoading, isError } = useQuery({
    queryKey: ['certifications'],
    queryFn: async (): Promise<Certification[]> => {
      try {
        return await fetchGet<Certification[]>('exam');
      } catch (error) {
        console.error('자격증 목록을 가져오는 중 오류 발생:', error);
        // 임시 데이터 (실제 API 연결 전 테스트용)
        return [
          { certificationId: 1, certificationName: '정보처리기사' },
          { certificationId: 2, certificationName: '전기기사' },
          { certificationId: 3, certificationName: '인테리어기사' },
          { certificationId: 4, certificationName: '토목기사' },
          { certificationId: 5, certificationName: '건축기사' },
          { certificationId: 6, certificationName: '정보처리기사' },
          { certificationId: 7, certificationName: '전기기사' },
          { certificationId: 8, certificationName: '인테리어기사' },
          { certificationId: 9, certificationName: '토목기사' },
          { certificationId: 10, certificationName: '건축기사' },
        ];


      }
    },
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 신선한 상태로 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });

  // 검색 결과 필터링
  const filteredCertifications = searchQuery
    ? certifications.filter(cert =>
        cert.certificationName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : certifications;

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
  };

  const selectCertification = (cert: Certification): void => {
    setSelectedCertifications(prev => {
      const isAlreadySelected = prev.some(item => item.certificationId === cert.certificationId);
      if (isAlreadySelected) {
        return prev.filter(item => item.certificationId !== cert.certificationId);
      }
      return [...prev, cert];
    });
    setIsSearchFocused(false);
  };

  const handleComplete = () => {
    // 선택된 자격증이 없는 경우
    if (selectedCertifications.length === 0) {
      if (onSelectCertification) {
        // 빈 자격증 객체 생성
        onSelectCertification({
          certificationId: -1,
          certificationName: '',
        });
      } else if (navigation) {
        navigateToHome();
      }
      return;
    }

    // 선택된 자격증이 있는 경우
    if (onSelectCertification && selectedCertifications.length > 0) {
      // 첫 번째 자격증만 전달하는 기존 방식 유지 (호환성)
      onSelectCertification(selectedCertifications[0]);
    } else if (navigation) {
      // 여러 자격증을 전달
      navigateToHome(selectedCertifications);
    }
  };

  // 홈 화면으로 이동하는 함수
  const navigateToHome = (selectedCerts?: Certification | Certification[]) => {
    navigation?.reset({
      index: 0,
      routes: [
        {
          name: authNavigation.HOME,
          ...(selectedCerts && { params: { certifications: selectedCerts } }),
          state: {
            routes: [
              {
                name: 'Home',
                ...(selectedCerts && { params: { certifications: selectedCerts } }),
              },
            ],
          },
        },
      ],
    });
  };

  const renderSelectedCertifications = () => {
    if (selectedCertifications.length === 0) {return null;}

    return (
      <View style={styles.selectedContainer}>
        {selectedCertifications.map((cert) => (
          <TouchableOpacity
            key={cert.certificationId}
            style={styles.selectedChip}
            onPress={() => selectCertification(cert)}
          >
            <Text style={styles.selectedChipText}>{cert.certificationName}</Text>
            <Text style={styles.removeIcon}>×</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleOutsidePress = () => {
    setIsSearchFocused(false);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>자격증 선택</Text>
          {renderSelectedCertifications()}
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.searchContainer}>
              <TextInput
                style={[
                  styles.searchInput,
                  isSearchFocused && styles.searchInputFocused,
                ]}
                placeholder="자격증 검색"
                value={searchQuery}
                onChangeText={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                autoCorrect={false}
                placeholderTextColor={colors[theme].GRAY_400}
              />
              {isSearchFocused && (
                <View style={styles.resultsContainer}>
                  {isLoading ? (
                    <Text style={styles.emptyText}>로딩 중...</Text>
                  ) : isError ? (
                    <Text style={styles.emptyText}>데이터를 불러오는 중 오류가 발생했습니다.</Text>
                  ) : (
                    <FlatList
                      data={filteredCertifications}
                      keyExtractor={item => item.certificationId.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.itemContainer,
                            selectedCertifications.some(cert => cert.certificationId === item.certificationId) &&
                            styles.itemContainerSelected,
                          ]}
                          onPress={() => selectCertification(item)}
                        >
                          <Text style={[
                            styles.itemText,
                            selectedCertifications.some(cert => cert.certificationId === item.certificationId) &&
                            styles.itemTextSelected,
                          ]}>{item.certificationName}</Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={
                        <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
                      }
                    />
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styling = (theme: themeMode, insets: EdgeInsets) => ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[theme].WHITE,
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '66@mvs',
  },
  title: {
    color: colors[theme].MAIN,
    marginBottom: '20@ms',
    textAlign: 'center',
    fontSize: '24@ms0.2',
  },
  searchContainer: {
    width: '80%',
    maxWidth: 600,
  },
  searchInput: {
    height: '50@mvs',
    borderWidth: 1,
    borderColor: colors[theme].GRAY_400,
    borderRadius: '8@ms',
    paddingHorizontal: '16@ms',
    paddingVertical: '16@mvs',
    color: colors[theme].BLACK,
    backgroundColor: colors[theme].WHITE,
  },
  searchInputFocused: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  resultsContainer: {
    maxHeight: '300@mvs',
    backgroundColor: colors[theme].WHITE,
    borderColor: colors[theme].GRAY_400,
    borderBottomLeftRadius: '8@ms',
    borderBottomRightRadius: '8@ms',
    borderTopWidth: 0,
    borderWidth: 1,
  },
  itemContainer: {
    padding: '16@ms',
  },
  itemText: {
    fontSize: '16@ms0.2',
    color: colors[theme].BLACK,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: '20@ms',
    fontSize: '16@ms0.2',
    color: colors[theme].GRAY_400,
    paddingBottom: '20@ms',
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8@ms',
    paddingHorizontal: '16@ms',
    marginBottom: '20@ms',
    width: '80%',
    maxWidth: 600,
    justifyContent: 'center',
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors[theme].MAIN,
    paddingVertical: '6@ms',
    paddingHorizontal: '12@ms',
    borderRadius: '16@ms',
    gap: '4@ms',
  },
  selectedChipText: {
    color: colors[theme].WHITE,
    fontSize: '14@ms0.2',
  },
  removeIcon: {
    color: colors[theme].WHITE,
    fontSize: '16@ms0.2',
    marginLeft: '4@ms',
  },
  itemContainerSelected: {
    backgroundColor: colors[theme].GRAY_100,
  },
  itemTextSelected: {
    color: colors[theme].MAIN,
    fontWeight: 'bold',
  },
  completeButton: {
    width: '100%',
    height: '66@mvs',
    paddingBottom: insets.bottom - 12,
    backgroundColor: colors[theme].MAIN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: colors[theme].WHITE,
    fontSize: '16@mvs',
    fontWeight: 'bold',
  },
});

export default SelectCertification;

