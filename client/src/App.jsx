import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import './styles/styles.css';

import { useAuthStore } from './store/auth';
import { useContentStore } from './store/content';

import TopBanner from './components/header/TopBanner';
import Header from './components/header/Header';
import Banner from './components/header/Banner';
import Navigation from './components/navigation/Navigation';
import Popup from './components/shared/Popup';
import Register from './components/login/Register';
import LocalLogin from './components/login/LocalLogin';
import Account from './components/account/Account';
import Grid from './components/main/Grid';
import Admin from './components/admin/Admin';
import Footer from './components/Footer';

function App() {
  const { t } = useTranslation();

  const { getContents, contents } = useContentStore();
  const { authStatus, loginUser, logoutUser, getCurrentUser } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    async function initialize() {
      await getContents();
      await getCurrentUser();
      setIsLoading(false);
    }
    initialize();
  }, [getContents]);

  console.log('authStatus', authStatus);

  return (
    <div className="app-container">
      <TopBanner isLoggedIn={authStatus.isLoggedIn} name={authStatus.user ? authStatus.user.name : t("guest")}/>
      <Header /> 
      <Routes>
        <Route exact path="/" 
          element={
            <>
              <Navigation isLoggedIn={authStatus.isLoggedIn} isAdmin={authStatus.user ? authStatus.user.isAdmin : false} logoutUser={logoutUser} />
              {isLoading ? <Popup popupText={"Finding latest content..."}/> : null}
              <Grid contents={contents} />
            </>
          }
        />
        <Route path="/admin" 
          element={
            <>
              <Banner bannerString={"Site Administration"} />
              <Navigation isLoggedIn={authStatus.isLoggedIn} isAdmin={authStatus.user ? authStatus.user.isAdmin : false} logoutUser={logoutUser} />
              <Admin />
            </>
          }
        />
        <Route path="/register" 
          element={
            <>
              <Navigation isLoggedIn={authStatus.isLoggedIn} isAdmin={authStatus.user ? authStatus.user.isAdmin : false} logoutUser={logoutUser} />
              <Banner bannerString={"Register a New Account"} />
              <Register 
                isLoggedIn={authStatus.isLoggedIn} 
              />
            </>
          }
        />
        <Route path="/login" 
          element={
            <>
              <Navigation isLoggedIn={authStatus.isLoggedIn} isAdmin={authStatus.user ? authStatus.user.isAdmin : false} logoutUser={logoutUser} />
              <Banner bannerString={"Log In"} />
              <LocalLogin
                isLoggedIn={authStatus.isLoggedIn} 
                // isPasswordIncorrect={isPasswordIncorrect}
                // resetPasswordIncorrect={resetPasswordIncorrect}
                loginUser={loginUser}
                // forgotUser={forgotUser} 
              />
            </>
          }
        />
        <Route path="/account" 
          element={
            <>
              <Navigation isLoggedIn={authStatus.isLoggedIn} isAdmin={authStatus.user ? authStatus.user.isAdmin : false} />
              <Banner bannerString={"Your Account"} />
              <Account 
                isLoggedIn={authStatus.isLoggedIn} 
                // user={user}
                // userOrders={userOrders}
              />
            </>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
