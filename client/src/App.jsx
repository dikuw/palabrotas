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
import Flashcards from './components/flashcards/Flashcards';
import Grid from './components/main/Grid';
import Content from './components/content/Content';
import AddContent from './components/content/AddContent';
import EditContent from './components/content/EditContent';
import Admin from './components/admin/Admin';
import NotificationContainer from './components/notifications/NotificationContainer';
import Footer from './components/Footer';
import Feedback from './components/feedback/Feedback';
function App() {
  const { t } = useTranslation();

  const { getContents, getContentsSortedByVoteDesc } = useContentStore();
  const { authStatus, loginUser, logoutUser, getCurrentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    async function initialize() {
      await getContentsSortedByVoteDesc();
      await getCurrentUser();
      setIsLoading(false);
    }
    initialize();
  }, [getContents, getContentsSortedByVoteDesc]);

  return (
    <div className="app-container">
      <TopBanner isLoggedIn={authStatus.isLoggedIn} name={authStatus.user ? authStatus.user.name : t("guest")}/>
      <Header /> 
      <Navigation isLoggedIn={authStatus.isLoggedIn} isAdmin={authStatus.user ? authStatus.user.isAdmin : false} logoutUser={logoutUser} />
      <Routes>
        <Route path="/" 
          element={
            <>
              <SearchBar />
              {isLoading ? <Popup popupText={t("Finding latest content...")}/> : null}
              <Grid />
            </>
          }
        />
        <Route path="/admin" 
          element={
            <>
              <Banner bannerString={t("Site Administration")} />
              <Admin />
            </>
          }
        />
        <Route path="/register" 
          element={
            <>
              <Banner bannerString={t("Register a New Account")} />
              <Register 
                isLoggedIn={authStatus.isLoggedIn} 
              />
            </>
          }
        />
        <Route path="/login" 
          element={
            <>
              <Banner bannerString={t("Log In")} />
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
        <Route path="/content/:id" 
          element={
            <>
              <Banner bannerString={t("Entry Details")} />
              <Content />
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
        <Route path="/flashcards" 
          element={
            <>
              <Banner bannerString={t("Flashcards")} />
              <Flashcards 
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
        <Route path="/feedback" 
          element={
            <>
              <Banner bannerString={t("Feedback")} />
              <Feedback />
            </>
          }
        />
      </Routes>
      <NotificationContainer />
      <Footer />
    </div>
  );
};

export default App;
