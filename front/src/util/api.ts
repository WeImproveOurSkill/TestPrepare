import { fetchWithAutoRefresh } from './auth';
import Config from 'react-native-config';

// GET 요청
export const fetchGet = async <T>(endpoint: string): Promise<T> => {
  const url = `${Config.BASE_URL}${endpoint}`;
  const response = await fetchWithAutoRefresh(url, { credentials: 'include' });
  if (!response.ok) {throw new Error(`HTTP error! Status: ${response.status}`);}
  return response.json() as Promise<T>;
};

// POST 요청
export const fetchPost = async <T>(endpoint: string, data?: any): Promise<T | null> => {
  const options: RequestInit = {
    method: 'POST',
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetchWithAutoRefresh(`${Config.BASE_URL}${endpoint}`, options);

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
  const options: RequestInit = {
    method: 'PATCH',
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetchWithAutoRefresh(`${Config.BASE_URL}${endpoint}`, options);

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
  const response = await fetchWithAutoRefresh(`${Config.BASE_URL}${endpoint}`, {
    method: 'PUT',
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
  const options: RequestInit = {
    method: 'DELETE',
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetchWithAutoRefresh(`${Config.BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

// POST 요청
export const fetchGPTPost = async <T>(endpoint: string, data?: any): Promise<T | null> => {
  const options: RequestInit = {
    method: 'POST',
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetchWithAutoRefresh(`${Config.GPT_BASE_URL}${endpoint}`, options);

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
