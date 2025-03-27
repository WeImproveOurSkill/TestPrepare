import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import Accordion from '../../components/Accordion';
import BookView from './BookView';
import { Certification } from '../../selectCertification/SelectCertificationScreen';
import { fetchGet } from '../../../util/api';

const defaultSubjects: Subject[] = [
  { subjectId: 1, subjectName: '기본과목' },
  { subjectId: 2, subjectName: '기본과목' },
  { subjectId: 3, subjectName: '기본과목' },
  { subjectId: 4, subjectName: '기본과목' },
  { subjectId: 5, subjectName: '기본과목' },
];


export interface Subject {
  subjectId: number;
  subjectName: string;
}

interface props {
  certification: Certification;
}

const CertificationAccordion = ({ certification }: props) => {
  const styles = styling();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetchGet(`exam/certification/${certification.certificationId}`)
      .then((res: any) => {
        console.log('res', res);
          setSubjects(defaultSubjects);
      })
      .catch((err) => {
        console.log('err', err);
        setSubjects(defaultSubjects);
      });
  }, [certification.certificationId]);

  console.log('현재 subjects:', subjects);

  return (
    <Accordion
      title={certification.certificationName}
    >
      {subjects && subjects.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.bookList}>
            {subjects.map((item) => (
              <BookView
                key={item.subjectId.toString()}
                subjectId={item.subjectId}
                subjectName={item.subjectName}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.container}>
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
  bookList: {
    // padding: '8@ms',
    minHeight: '100@vs',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

export default CertificationAccordion;
