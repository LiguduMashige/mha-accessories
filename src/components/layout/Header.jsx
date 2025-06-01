import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import SearchBar from '../search/SearchBar';
import '../../styles/Header.css';

const Header = () => {
  const { getCartItemCount } = useContext(ShopContext);
  const cartItemCount = getCartItemCount();

  return (
    <div className="header-container">
      <div className="header-top">
        <div className="logo" onClick={() => window.location.href = '/'}>
          <img src="/images/mha-logo.svg" alt="MHA Logo" className="logo-image" />
        </div>

        <SearchBar />

        <div className="nav-icons">
          <Link className="nav-icon-link" to="/favourites">
            <FaHeart />
          </Link>
          <Link className="nav-icon-link" to="/cart">
            <FaShoppingCart />
            {cartItemCount > 0 && <div className="cart-count">{cartItemCount}</div>}
          </Link>
          <Link className="nav-icon-link" to="/profile">
            <FaUser />
          </Link>
        </div>
      </div>

      <div className="sub-nav">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/services">Services</Link>
      </div>
    </div>
  );
};

export default Header;
