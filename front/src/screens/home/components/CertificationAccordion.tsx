import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useQuery } from '@tanstack/react-query';
import Accordion from '../../components/Accordion';
import BookView from './BookView';
import { Certification } from '../../selectCertification/SelectCertificationScreen';
import { fetchGet } from '../../../util/api';
import { useSubjectStore, Subject } from '../../../store/useSubjectStore';

interface props {
  certification: Certification;
}

const CertificationAccordion = ({ certification }: props) => {
  const styles = styling();
  const { certificationId, certificationName } = certification;

  // Zustand 스토어에 데이터를 저장하는 액션 가져오기
  const setSubjectsInStore = useSubjectStore((state) => state.setSubjects);

  const {
    data: subjects,
    isLoading,
    error,
    isSuccess,
    isError,
  } = useQuery<Subject[], Error>({
    queryKey: ['subjects', certificationId],
    queryFn: () => fetchGet<Subject[]>(`exam/certification/${certificationId}`),
    enabled: !!certificationId,
  });


  // 성공 시 부수 효과 처리
  useEffect(() => {
    if (isSuccess && subjects) {
      setSubjectsInStore(certificationId, subjects);
    }
  }, [isSuccess, subjects, certificationId, setSubjectsInStore]);

  // 에러 시 부수 효과 처리
  useEffect(() => {
    if (isError && error) {
      console.error(`Failed to fetch subjects for certification ${certificationId}:`, error);
    }
  }, [isError, error, certificationId]);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <Accordion title={certificationName}>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" style={styles.indicator} />
        </View>
      </Accordion>
    );
  }

  // 에러 발생 시 UI
  if (isError) {
    return (
      <Accordion title={certificationName}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorText}>데이터를 불러오는 중 오류가 발생했습니다.</Text>
        </View>
      </Accordion>
    );
  }

  // 성공 시 UI
  return (
    <Accordion
      title={certificationName}
    >
      {isSuccess && subjects && subjects.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.bookList}>
            {subjects.map((item) => (
              <BookView
                key={item.subjectId.toString()}
                subjectId={item.subjectId}
                subjectName={item.subjectName}
                certificationId={certificationId}
              />
            ))}
            {/* <Image
              source={require('../../../constants/software.webp')}
              style={styles.bookImage}
              // resizeMode="contain"
              /> */}
          </View>
        </View>
      ) : (
        // 로딩 완료 후 데이터가 없는 경우
        <View style={[styles.container, styles.centerContent]}>
          <Text>데이터가 없습니다.</Text>
        </View>
      )}
    </Accordion>
  );
};

const styling = () => ScaledSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bookList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: '5@ms',
  },
  errorText: {
    color: 'red',
    fontSize: '14@ms',
  },
  bookImage: {
    width: '100@ms',
    height: '100@ms',
    borderRadius: '10@ms',
  },
  indicator: {
    width: '100@ms',
    height: '100@ms',
  },
});

export default CertificationAccordion;
