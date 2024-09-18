import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

import { useContentStore } from './store/content';

import TopBanner from './components/header/TopBanner';
import Header from './components/header/Header';
import Banner from './components/header/Banner';
import Navigation from './components/navigation/Navigation';
import Register from './components/login/Register';
import LocalLogin from './components/login/LocalLogin';
import Grid from './components/main/Grid';
import Admin from './components/admin/Admin';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const { getContents, contents } = useContentStore();

  useEffect(() => {
    getContents();
  }, [getContents]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);

  const navigate = useNavigate(); 

  const logoutUser = async (user) => {
    const payload = { ...user };
    await apis.logout(payload).then(res => {
      setIsLoggedIn(false);
      navigate("/");
    });
  }

  return (
    <div>
      <TopBanner isLoggedIn={isLoggedIn} name={user.name}/>
      <Header /> 
      <Routes>
        <Route exact path="/" 
          element={
            <>
              <Navigation isLoggedIn={isLoggedIn} isAdmin={user.isAdmin} logoutUser={logoutUser} />
              {isLoading ? <Popup popupText={"Finding latest content..."}/> : null}
              <Grid contents={contents} />
            </>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
