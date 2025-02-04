import './App.css';

function App() {

  const handleGoogleLogin = () => {
  	//로그인 요청
  	window.location.href = "http://localhost:8080/oauth2/authorization/google"; // 이거 주소를 바꾸던지 해보셈
}

  return (
    <div>
      <div>내 고향으로 온거 같다..</div>
      <button onClick={handleGoogleLogin}>버튼 클릭시 oauth2 실행</button>
    </div>
  );
}

export default App;
