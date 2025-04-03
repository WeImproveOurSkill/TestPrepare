import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import Accordion from '../../components/Accordion';
import BookView from './BookView';
import { Certification } from '../../selectCertification/SelectCertificationScreen';
import { fetchGet } from '../../../util/api';


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
        setSubjects(res);
      });
  }, [certification.certificationId]);

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
            {/* <Image
              source={require('../../../constants/software.webp')}
              style={styles.bookImage}
              // resizeMode="contain"
              /> */}
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
    width: '100%',
    alignItems: 'center',
  },
  bookList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  bookImage: {
    width: '100@ms',
    height: '100@ms',
    borderRadius: '10@ms',
  },
});

export default CertificationAccordion;
