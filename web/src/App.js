import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // URL에서 토큰 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', token);
      // 토큰 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  }

  return (
    <div>
      <div>내 고향으로 온거 같다..</div>
      <button onClick={handleKakaoLogin}>카카오 로그인</button>
    </div>
  );
}

export default App;
