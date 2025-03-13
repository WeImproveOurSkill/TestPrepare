import { create } from 'zustand';
import { Certification } from '../screens/selectCertification/SelectCertificationScreen';

interface CertificationState {
  selectedCertifications: Certification[];
  addCertification: (cert: Certification) => void;
  removeCertification: (certId: number) => void;
  toggleCertification: (cert: Certification) => void;
  clearCertifications: () => void;
}

const useCertificationStore = create<CertificationState>((set) => ({
  selectedCertifications: [],
  addCertification: (cert) =>
    set((state) => ({
      selectedCertifications: [...state.selectedCertifications, cert],
    })),
  removeCertification: (certId) =>
    set((state) => ({
      selectedCertifications: state.selectedCertifications.filter(
        (cert) => cert.certificationId !== certId
      ),
    })),
  toggleCertification: (cert) =>
    set((state) => {
      const isSelected = state.selectedCertifications.some(
        (item) => item.certificationId === cert.certificationId
      );
      return {
        selectedCertifications: isSelected
          ? state.selectedCertifications.filter(
              (item) => item.certificationId !== cert.certificationId
            )
          : [...state.selectedCertifications, cert],
      };
    }),
  clearCertifications: () =>
    set({
      selectedCertifications: [],
    }),
}));

export default useCertificationStore;
