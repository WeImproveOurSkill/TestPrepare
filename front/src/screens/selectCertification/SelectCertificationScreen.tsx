import React, { useState } from 'react';
import { TextInput, FlatList, Text, Pressable, View, ActivityIndicator } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import useThemeStore, { themeMode } from '../../store/useThemeStore';
import { colors } from '../../constants/colors';
import { fetchGet } from '../../util/api';
import { RootStackParamList } from '../../navigation/RootStackNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import useCertificationStore from '../../store/useCertificationStore';

export interface Certification {
  certificationId: number;
  certificationName: string;
}

const SelectCertificationScreen = () => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();
  const styles = styling(theme, insets);
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList, 'SelectCertification'>['navigation']>();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const { selectedCertifications, toggleCertification } = useCertificationStore();

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
    toggleCertification(cert);
  };

  const handleComplete = () => {
    navigation.replace('HomeStack', {
      screen: 'MainTab',
      params: { certifications: selectedCertifications },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>자격증 선택</Text>

        {/* 선택된 자격증 표시 영역 */}
        {selectedCertifications.length > 0 && (
          <View style={styles.selectedContainer}>
            {selectedCertifications.map((cert) => (
              <Pressable
                key={cert.certificationId}
                style={({ pressed }) => [
                  styles.selectedChip,
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => selectCertification(cert)}
              >
                <Text style={styles.selectedChipText}>{cert.certificationName}</Text>
                <Text style={styles.removeIcon}>×</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* 검색 영역 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="자격증 검색"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCorrect={false}
            placeholderTextColor={colors[theme].GRAY_400}
          />

          {/* 검색 결과 목록 */}
          <View style={styles.resultsContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors[theme].MAIN} />
            ) : isError ? (
              <Text style={styles.emptyText}>데이터를 불러오는 중 오류가 발생했습니다.</Text>
            ) : (
              <FlatList
                data={filteredCertifications}
                keyExtractor={item => item.certificationId.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.itemContainer,
                      selectedCertifications.some(cert => cert.certificationId === item.certificationId) &&
                      styles.itemContainerSelected,
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => selectCertification(item)}
                  >
                    <Text style={[
                      styles.itemText,
                      selectedCertifications.some(cert => cert.certificationId === item.certificationId) &&
                      styles.itemTextSelected,
                    ]}>{item.certificationName}</Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
                }
              />
            )}
          </View>
        </View>
      </View>

      {/* 완료 버튼 */}
      <Pressable
        style={({ pressed }) => [
          styles.completeButton,
          pressed && { opacity: 0.7 },
        ]}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>완료</Text>
      </Pressable>
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
  resultsContainer: {
    maxHeight: '300@mvs',
    backgroundColor: colors[theme].WHITE,
    borderColor: colors[theme].GRAY_400,
    borderRadius: '8@ms',
    borderWidth: 1,
    marginTop: '8@ms',
    overflow: 'hidden',
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

export default SelectCertificationScreen;
