import "../src/App.css";
import { ThemeProvider } from "./context/ThemeContext";
import AppRouter from "./Router.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>      
        <AppRouter />
      <Footer/>
      </AuthProvider>

    </ThemeProvider>
    
  );
};

export default App;
