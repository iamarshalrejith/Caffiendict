import React from "react";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import CoffeeForm from "./components/CoffeeForm";
import Stats from "./components/Stats";
import History from "./components/History";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { globalUser, isLoading, globalData } = useAuth();
  const isAuthenticated = globalUser;
  const isData = globalData && !!Object.keys(globalData || {}).length;

  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  );

  return (
    <Layout>
      <Hero />
      <CoffeeForm isAuthenticated={isAuthenticated} />
      
      {(isAuthenticated && isLoading) && <p>Loading Data...</p>}
      {(isAuthenticated && isData) && authenticatedContent}
    </Layout>
  );
};

export default App;
