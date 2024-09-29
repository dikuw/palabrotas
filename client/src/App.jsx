import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import './styles/styles.css';

import { useAuthStore } from './store/auth';
import { useContentStore } from './store/content';

import { TopBanner, Header, Banner, SearchBar } from './components/header';
import Navigation from './components/navigation/Navigation';
import Popup from './components/shared/Popup';
import Register from './components/login/Register';
import LocalLogin from './components/login/LocalLogin';
import Account from './components/account/Account';
import Grid from './components/main/Grid';
import AddContent from './components/content/AddContent';
import EditContent from './components/content/EditContent';
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
      <Navigation isLoggedIn={authStatus.isLoggedIn} isAdmin={authStatus.user ? authStatus.user.isAdmin : false} logoutUser={logoutUser} />
      <Routes>
        <Route exact path="/" 
          element={
            <>
              <SearchBar />
              {isLoading ? <Popup popupText={"Finding latest content..."}/> : null}
              <Grid />
            </>
          }
        />
        <Route path="/admin" 
          element={
            <>
              <Banner bannerString={"Site Administration"} />
              <Admin />
            </>
          }
        />
        <Route path="/register" 
          element={
            <>
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
              <Banner bannerString={t("Your Account")} />
              <Account 
                isLoggedIn={authStatus.isLoggedIn} 
              />
            </>
          }
        />
        <Route path="/addContent" 
          element={
            <>
              <Banner bannerString={t("Add Content")} />
              <AddContent
                isLoggedIn={authStatus.isLoggedIn} 
              />
            </>
          }
        />
        <Route path="/editContent/:id" 
          element={
            <>
              <Banner bannerString={t("Edit Content")} />
              <EditContent
                isLoggedIn={authStatus.isLoggedIn} 
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
