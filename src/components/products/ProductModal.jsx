import React, { useState, useContext, useEffect } from 'react';
import { FaHeart, FaTimes, FaMinus, FaPlus } from 'react-icons/fa';
import { ShopContext } from '../../context/ShopContext';
import '../../styles/ProductModal.css';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addToCart, buyNow, favorites, toggleFavorite } = useContext(ShopContext);
  const [quantity, setQuantity] = useState(1);
  const [selectedScent, setSelectedScent] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const isFavorite = favorites[product?.id];

  useEffect(() => {
    if (isOpen && product) {
      // Reset state when modal opens
      setQuantity(1);
      if (product.scents && product.scents.length > 0) {
        setSelectedScent(product.scents[0]);
      } else {
        setSelectedScent('');
      }
      setShowConfirmation(false);
      
      // Disable scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, product]);

  if (!product) return null;

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedScent, product.medium);
    setShowConfirmation(true);
  };

  const handleBuyNow = () => {
    buyNow(product.id, quantity, selectedScent, product.medium);
    onClose();
    // Navigate to cart page after adding to cart
    window.location.href = '/cart';
  };

  const handleFavoriteClick = () => {
    toggleFavorite(product.id);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleViewCart = () => {
    onClose();
    // Navigate to cart page
    window.location.href = '/cart';
  };

  const handleCheckout = () => {
    onClose();
    // Navigate to checkout page
    window.location.href = '/checkout';
  };

  return (
    <>
      {isOpen && (
        <>
          <div 
            className="modal-overlay fade-in"
            onClick={onClose}
          />
          <div
            className="modal-container scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}>
              <FaTimes />
            </button>
            
            <div className="modal-content">
              <img className="product-image" src={product.image} alt={product.name} />
              
              <div className="product-details">
                <div className="product-header">
                  <h2 className="product-name">{product.name}</h2>
                </div>
                
                <p className="product-description">{product.description}</p>
                
                <div className="product-price-row">
                  <div className="product-price">R{product.price}</div>
                  <button 
                    className={`favorite-button-modal ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label="Add to favorites"
                  >
                    <FaHeart />
                    <span>{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
                  </button>
                </div>
                
                {product.size && (
                  <div className="product-attribute">
                    <span className="attribute-label">Size:</span>
                    <span className="attribute-value">{product.size}</span>
                  </div>
                )}
                
                {product.medium && (
                  <div className="product-attribute">
                    <span className="attribute-label">Medium:</span>
                    <span className="attribute-value">{product.medium}</span>
                  </div>
                )}
                
                {product.scents && product.scents.length > 0 && (
                  <div className="scent-selector">
                    <span className="attribute-label">Scent:</span>
                    <div className="scent-options">
                      {product.scents.map(scent => (
                        <button
                          key={scent}
                          className={`scent-option ${selectedScent === scent ? 'selected' : ''}`}
                          onClick={() => setSelectedScent(scent)}
                        >
                          {scent}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="quantity-selector">
                  <span className="attribute-label">Quantity:</span>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      className="quantity-button"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                
                <div className={`stock-info ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 
                    ? `In Stock: ${product.stock} available` 
                    : 'Out of Stock'}
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="buy-now-button"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {showConfirmation && (
            <div className="confirmation-popup fade-in">
              <button className="close-confirmation-button" onClick={handleCloseConfirmation}>
                <FaTimes />
              </button>
              <p className="confirmation-message">
                {product.name} has been added to your cart!
              </p>
              <div className="confirmation-buttons">
                <button className="view-cart-button" onClick={handleViewCart}>
                  View Cart
                </button>
                <button className="checkout-button" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductModal;
