import { create } from 'zustand';
import { Certification } from '../screens/selectCertification/SelectCertificationScreen';
import { setEncryptStorage, getEncryptStorage, CertificationKey } from '../util/encryptStorage';

interface CertificationState {
  selectedCertifications: Certification[];
  addCertification: (cert: Certification) => void;
  removeCertification: (certId: number) => void;
  toggleCertification: (cert: Certification) => void;
  setCertifications: (certifications: Certification[]) => void;
  loadCertifications: () => Promise<void>;
}

const useCertificationStore = create<CertificationState>((set, get) => ({
  selectedCertifications: [],
  addCertification: (cert) => {
    const newCerts = [...get().selectedCertifications, cert];
    set({ selectedCertifications: newCerts });
    setEncryptStorage(CertificationKey, newCerts);
  },
  removeCertification: (certId) => {
    const newCerts = get().selectedCertifications.filter(
      (cert) => cert.certificationId !== certId
    );
    set({ selectedCertifications: newCerts });
    setEncryptStorage(CertificationKey, newCerts);
  },
  toggleCertification: (cert) => {
    const state = get();
    const isSelected = state.selectedCertifications.some(
      (item) => item.certificationId === cert.certificationId
    );
    let newCerts;
    if (isSelected) {
      newCerts = state.selectedCertifications.filter(
        (item) => item.certificationId !== cert.certificationId
      );
    } else {
      newCerts = [...state.selectedCertifications, cert];
    }
    set({ selectedCertifications: newCerts });
    setEncryptStorage(CertificationKey, newCerts);
  },
  setCertifications: (certifications) => {
    set({ selectedCertifications: certifications });
    setEncryptStorage(CertificationKey, certifications);
  },
  loadCertifications: async () => {
    const stored = await getEncryptStorage(CertificationKey);
    if (stored) {
      set({ selectedCertifications: stored });
    }
  },
}));

export default useCertificationStore;
