import { getEncryptStorage, AccessKey, setEncryptStorage, UserNameKey, UserNicknameKey, removeEncryptStorage } from './encryptStorage';
import Config from 'react-native-config';

export const initializeAuth = async (setLoggedIn: (loggedIn: boolean) => void) => {
  try {
    console.log('앱 시작 - 토큰 확인 중...');
    const token = await getEncryptStorage(AccessKey);

    if (token) {
      console.log('저장된 토큰 발견 - 자동 로그인');
      setLoggedIn(true);
    } else {
      console.log('토큰 없음 - 로그인 필요');
      setLoggedIn(false);
    }
  } catch (error) {
    console.error('인증 초기화 실패:', error);
    setLoggedIn(false);
  }
};

// 헤더 생성 함수 - 사전 토큰 갱신 포함
export const createHeaders = async (): Promise<Headers> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  try {
    const token = await ensureValidToken(); // 🔄 사전 갱신 로직
    if (token) {
      headers.append('Authorization', `${token}`);
      console.log('Authorization', `${token}`);
    }
  } catch (error) {
    console.log('토큰 처리 중 오류 발생:', error);
  }

  return headers;
};

type FetchOptions = RequestInit & { retryOn401?: boolean };

// 리프레시 토큰으로 새 액세스 토큰 발급받는 함수
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const username = await getEncryptStorage(UserNameKey);
    if (!username) {
      return null;
    }

    const response = await fetch(`${Config.BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
      }),
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      await setEncryptStorage(AccessKey, accessToken); // 새 토큰 저장
      return accessToken;
    } else {
      // 토큰 갱신 실패 시 로컬 데이터 정리
      await removeEncryptStorage(AccessKey);
      await removeEncryptStorage(UserNameKey);
      await removeEncryptStorage(UserNicknameKey);
      return null;
    }

  } catch (error) {
    console.error('토큰 리프레시 실패:', error);
    return null;
  }
};

// JWT 토큰 디코딩해서 만료 시간 확인
const isTokenExpiringSoon = (token: string, bufferMinutes: number = 5): boolean => {
  try {
    // Bearer 접두사 제거 후 JWT 디코딩
    const cleanToken = token.replace(/^Bearer\s+/, '');
    const payload = JSON.parse(atob(cleanToken.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초)
    const expirationTime = payload.exp; // 토큰 만료 시간 (초)

    // 만료 시간 - 버퍼 시간(기본 5분) 전에 갱신
    return (expirationTime - currentTime) < (bufferMinutes * 60);
  } catch (error) {
    console.error('토큰 파싱 실패:', error);
    return true; // 파싱 실패 시 갱신 필요로 간주
  }
};

// 토큰 사전 갱신 함수
const ensureValidToken = async (): Promise<string | null> => {
  try {
    const currentToken = await getEncryptStorage(AccessKey);

    if (!currentToken) {
      return null; // 토큰이 없으면 로그인 필요
    }

    // 토큰이 곧 만료되는지 확인 (5분 전에 미리 갱신)
    if (isTokenExpiringSoon(currentToken, 5)) {
      console.log('토큰이 곧 만료됩니다. 사전 갱신을 시도합니다.');
      const newToken = await refreshAccessToken();
      return newToken || currentToken; // 갱신 실패 시 기존 토큰 사용
    }

    return currentToken; // 아직 유효한 토큰
  } catch (error) {
    console.error('토큰 확인 실패:', error);
    return null;
  }
};

// fetchWithAutoRefresh 수정
export async function fetchWithAutoRefresh(
  url: string,
  options: FetchOptions = {},
  createHeadersFn = createHeaders
): Promise<Response> {
  const { retryOn401, ...fetchOptions } = options;
  let headers = await createHeadersFn(); // 이미 사전 갱신 완료
  let response = await fetch(url, { ...fetchOptions, headers });

  // 그래도 401이 발생하면 한 번 더 시도 (fallback)
  if (response.status === 401 && retryOn401 !== false) {
    console.log('사전 갱신에도 불구하고 401 발생, 추가 갱신 시도');
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      headers = await createHeadersFn();
      response = await fetch(url, { ...fetchOptions, headers });
    } else {
      throw new Error('토큰 재발급 실패 - 로그인이 필요합니다');
    }
  }
  return response;
}
