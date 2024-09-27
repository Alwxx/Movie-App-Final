import { useContext } from 'react';
import './Footer.css';
import ThemeContext from '../../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext); // Access theme from context

  return (
    <footer className={`footer ${theme}`}>
      <div className="footer-content">
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
        <div className="footer-copyright">
          <p>© 2024 Movie Review App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
