import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
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
import Course from './components/course/Course';
import Chat from './components/chat/Chat';
import Grid from './components/main/Grid';
import Content from './components/content/Content';
import AddContent from './components/content/AddContent';
import EditContent from './components/content/EditContent';
import Admin from './components/admin/Admin';
import NotificationContainer from './components/notifications/NotificationContainer';
import Footer from './components/Footer';
import AddFeedback from './components/feedback/AddFeedback';
import AddTag from './components/tag/AddTag';

const StyledAppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  background-color: white;
  background-image: 
    linear-gradient(var(--primary) 1px, transparent 1px),
    linear-gradient(90deg, var(--primary) 1px, transparent 1px);
  background-size: 50px 50px;
`;

const StyledMainContent = styled.div`
  flex: 1 0 auto;
  width: 100%;
`;

function App() {
  const { t } = useTranslation();

  const { getContents, getContentsSortedByVoteDesc } = useContentStore();
  const { authStatus, loginUser, logoutUser, getCurrentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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
    <StyledAppContainer>
      <TopBanner isLoggedIn={authStatus.isLoggedIn} name={authStatus.user ? authStatus.user.name : t("guest")}/>
      <Header /> 
      <Navigation isLoggedIn={authStatus.isLoggedIn} isAdmin={authStatus.user ? authStatus.user.isAdmin : false} logoutUser={logoutUser} />
      
      <StyledMainContent>
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
                <Admin />
              </>
            }
          />
          <Route path="/register" 
            element={
              <>
                <Register 
                  isLoggedIn={authStatus.isLoggedIn} 
                />
              </>
            }
          />
          <Route path="/login" 
            element={
              <>
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
                <Content />
              </>
            }
          />
          <Route path="/account" 
            element={
              <>
                <Account 
                  isLoggedIn={authStatus.isLoggedIn} 
                />
              </>
            }
          />
          <Route path="/flashcards" 
            element={
              <>
                <Flashcards 
                  isLoggedIn={authStatus.isLoggedIn} 
                />
              </>
            }
          />
          <Route path="/course" 
            element={
              <>
                <Course 
                  isLoggedIn={authStatus.isLoggedIn} 
                />
              </>
            }
          />
          <Route path="/chat" 
            element={
              <>
                <Chat 
                  isLoggedIn={authStatus.isLoggedIn} 
                />
              </>
            }
          />
          <Route path="/addContent" 
            element={
              <>
                <AddContent
                  isLoggedIn={authStatus.isLoggedIn} 
                />
              </>
            }
          />
          <Route path="/editContent/:id" 
            element={
              <>
                <EditContent
                  isLoggedIn={authStatus.isLoggedIn} 
                />
              </>
            }
          />
          <Route path="/addfeedback" 
            element={
              <>
                <Banner bannerString={t("Add Feedback")} />
                <AddFeedback />
              </>
            }
          />
          <Route path="/addTag" 
            element={
              <>
                <Banner bannerString={t("Add Tag")} />
                <AddTag
                  isLoggedIn={authStatus.isLoggedIn} 
                />
              </>
            }
          />
        </Routes>
        <NotificationContainer />
      </StyledMainContent>
      <Footer />
    </StyledAppContainer>
  );
};

export default App;
