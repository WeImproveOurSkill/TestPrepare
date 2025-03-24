import { getEncryptStorage, JwtKey } from '../util/encryptStorage';
import Config from 'react-native-config';

// 헤더 생성 함수 - 토큰이 있으면 포함, 없으면 기본 헤더만 반환
const createHeaders = async (): Promise<Headers> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  try {
    const token = await getEncryptStorage(JwtKey);
    if (token) {
      headers.append('Authorization', token);
    }
  } catch (error) {
    console.log('토큰이 없거나 가져오는 중 오류 발생');
  }

  return headers;
};

// GET 요청
export const fetchGet = async <T>(endpoint: string): Promise<T> => {
  const headers = await createHeaders();

  const response = await fetch(`${Config.BASE_URL}${endpoint}`, {
    headers,
    credentials: 'include',
  });
  console.log(`${Config.BASE_URL}${endpoint}`);


  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

// POST 요청
export const fetchPost = async <T>(endpoint: string, data: any): Promise<T> => {
  const headers = await createHeaders();


  const response = await fetch(`${Config.BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

// PUT 요청
export const fetchPut = async <T>(endpoint: string, data: any): Promise<T> => {
  const headers = await createHeaders();


  const response = await fetch(`${Config.BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

// DELETE 요청
export const fetchDelete = async <T>(endpoint: string, data?: any): Promise<T> => {
  const headers = await createHeaders();


  const options: RequestInit = {
    method: 'DELETE',
    headers,
    credentials: 'include',
  };

  // DELETE 요청에 body가 필요한 경우 추가
  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${Config.BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};
