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

type FetchOptions = RequestInit & { retryOn401?: boolean };

export async function fetchWithAutoRefresh(
  url: string,
  options: FetchOptions = {},
  createHeadersFn = createHeaders
): Promise<Response> {
  const { retryOn401, ...fetchOptions } = options; // retryOn401만 분리
  let headers = await createHeadersFn();
  let response = await fetch(url, { ...fetchOptions, headers });

  if (response.status === 401 && retryOn401 !== false) {
    const newToken = await getEncryptStorage(JwtKey);
    if (newToken) {
      headers = await createHeadersFn();
      response = await fetch(url, { ...fetchOptions, headers });
    } else {
      throw new Error('토큰 재발급 실패');
    }
  }
  return response;
}

// GET 요청
export const fetchGet = async <T>(endpoint: string): Promise<T> => {
  const url = `${Config.BASE_URL}${endpoint}`;
  const response = await fetchWithAutoRefresh(url, { credentials: 'include' });
  if (!response.ok) {throw new Error(`HTTP error! Status: ${response.status}`);}
  return response.json() as Promise<T>;
};

// POST 요청
export const fetchPost = async <T>(endpoint: string, data?: any): Promise<T | null> => {
  const headers = await createHeaders();

  const options: RequestInit = {
    method: 'POST',
    headers,
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${Config.BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    console.log(response);
    throw new Error(`HTTP error! Status: ${response.status}`);

  }

  // 200이지만 body가 비어 있을 수 있으므로 예외 처리
  const text = await response.text();
  if (!text || text.trim() === '') {
    // body가 비어 있으면 null 반환
    return null;
  }
  return JSON.parse(text) as T;
};

// PATCH 요청
export const fetchPatch = async <T>(endpoint: string, data?: any): Promise<T | null> => {
  const headers = await createHeaders();

  const options: RequestInit = {
    method: 'PATCH',
    headers,
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${Config.BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // 200이지만 body가 비어 있을 수 있으므로 예외 처리
  const text = await response.text();
  if (!text || text.trim() === '') {
    // body가 비어 있으면 null 반환
    return null;
  }
  return JSON.parse(text) as T;
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

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${Config.BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

// POST 요청
export const fetchGPTPost = async <T>(endpoint: string, data?: any): Promise<T | null> => {
  const headers = await createHeaders();

  const options: RequestInit = {
    method: 'POST',
    headers,
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${Config.GPT_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // 200이지만 body가 비어 있을 수 있으므로 예외 처리
  const text = await response.text();
  if (!text || text.trim() === '') {
    // body가 비어 있으면 null 반환
    return null;
  }
  return JSON.parse(text) as T;
};
