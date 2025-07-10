import EncryptedStorage from 'react-native-encrypted-storage';

const AccessKey = 'access_token';
const UserNameKey = 'user_name';
const UserProviderKey = 'user_provider';
const UserNicknameKey = 'user_nickname';
const CertificationKey = 'certification';
const BookMarkKey = 'bookmarks';

const setEncryptStorage = async <T>( key: string, data: T ) => {
  await EncryptedStorage.setItem(key, JSON.stringify(data));
};

const getEncryptStorage = async ( key: string) => {
  const storedData = await EncryptedStorage.getItem(key);

  return storedData && JSON.parse(storedData);
};

const removeEncryptStorage = async ( key: string) => {
  const data = await getEncryptStorage(key);

  if (data) {
    await EncryptedStorage.removeItem(key);
  }
};

export {setEncryptStorage, getEncryptStorage, removeEncryptStorage, AccessKey, UserNameKey, UserProviderKey, UserNicknameKey, CertificationKey, BookMarkKey };
