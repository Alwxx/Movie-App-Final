import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";

const Footer = () => {
  const { theme } = useContext(ThemeContext); // Access theme from context

  return (
    <footer className={`footer bg-gray-100 shadow-lg dark:bg-gray-900`}>
      <div className="flex items-center justify-center py-8 text-gray-900 dark:text-white">
        <div className="footer-copyright">
          <p>© 2024 Movie Review App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
