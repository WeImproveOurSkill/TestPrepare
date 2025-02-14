import {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import useThemeStore, { themeMode } from '../store/useThemeStore';
import { getEncryptStorage, setEncryptStorage } from '../util/encryptStorage';

function useThemeStorage() {
  const systemTheme = useColorScheme();
  const {theme, isSystem, setTheme, setSystemTheme} = useThemeStore();

  const setMode = async (mode: themeMode) => {
    await setEncryptStorage('themeMode', mode);
    setTheme(mode);
  };

  const setSystem = async (flag: boolean) => {
    await setEncryptStorage('themeSystem', flag);
    setSystemTheme(flag);
  };

  useEffect(() => {
    (async () => {
      const mode = (await getEncryptStorage('themeMode')) ?? 'light';
      const systemMode =
        (await getEncryptStorage('themeSystem')) ?? false;

      const newMode = systemMode ? systemTheme : mode;
      setTheme(newMode);
      setSystemTheme(systemMode);
    })();
  }, [setTheme, setSystemTheme, systemTheme]);

  return {theme, isSystem, setMode, setSystem};
}

export default useThemeStorage;
