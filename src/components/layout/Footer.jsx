import React from 'react';
import { FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="disclaimer-section">
        <h3 className="disclaimer-title">Disclaimer</h3>
        <p className="disclaimer-text">
          As our products are specially hand-crafted, please note that there is a lead time of 2–4 days for the completion of your order. Thank you for understanding!
        </p>
      </div>
      
      <div className="social-section">
        <a className="social-icon" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a className="social-icon" href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
          <FaTiktok />
        </a>
        <a className="social-icon" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
      </div>
      
      <p className="copyright-text">
        © 2023, Masibonge Home Accessories – Powered by Ligoody2Shoes
      </p>
    </footer>
  );
};


export default Footer;
