import React, { createContext, useState, useEffect } from 'react';
import productsData from '../data/products.json';

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [favorites, setFavorites] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Simulate data loading with useEffect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Initialize cart items
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    const storedFavorites = localStorage.getItem('favorites');
    
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    } else {
      // Start with an empty cart
      setCartItems({});
    }

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    } else {
      const initialFavorites = {};
      products.forEach((product) => {
        initialFavorites[product.id] = false;
      });
      setFavorites(initialFavorites);
    }
  }, [products]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(favorites).length > 0) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => {
      // Search by name, category, description, scent
      const nameMatch = product.name.toLowerCase().includes(query);
      const categoryMatch = product.category.toLowerCase().includes(query);
      const descriptionMatch = product.description && product.description.toLowerCase().includes(query);
      
      // Check if scents array exists and if any scent matches the query
      const scentMatch = product.scents && 
        product.scents.some(scent => scent.toLowerCase().includes(query));
      
      // Check if medium exists and matches the query
      const mediumMatch = product.medium && 
        product.medium.toLowerCase().includes(query);

      return nameMatch || categoryMatch || descriptionMatch || scentMatch || mediumMatch;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Add to cart function
  const addToCart = (productId, quantity, scent, medium, giftCardDetails = null) => {
    setCartItems(prev => {
      // If this is a gift card, include gift card details
      if (giftCardDetails) {
        return {
          ...prev,
          [productId]: {
            quantity: quantity,
            customPrice: giftCardDetails.customPrice,
            isGift: giftCardDetails.isGift,
            giftMessage: giftCardDetails.giftMessage || '',
            scent: null,
            medium: null
          }
        };
      } else {
        // Standard product
        return {
          ...prev,
          [productId]: {
            quantity: (prev[productId]?.quantity || 0) + quantity,
            scent: scent || prev[productId]?.scent,
            medium: medium || prev[productId]?.medium
          }
        };
      }
    });
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      const newCartItems = { ...cartItems };
      delete newCartItems[productId];
      setCartItems(newCartItems);
    } else {
      setCartItems(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity
        }
      }));
    }
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    const newCartItems = { ...cartItems };
    delete newCartItems[productId];
    setCartItems(newCartItems);
  };

  // Toggle favorite status
  const toggleFavorite = (productId) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Calculate cart total
  const getCartTotal = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const cartItem = cartItems[itemId];
      
      if (cartItem.quantity > 0) {
        // Check if this is a gift card with a custom price
        if (cartItem.customPrice) {
          total += cartItem.customPrice * cartItem.quantity;
        } else {
          // Regular product
          const itemInfo = products.find(product => product.id === parseInt(itemId));
          if (itemInfo) {
            total += itemInfo.price * cartItem.quantity;
          }
        }
      }
    }
    return total;
  };

  // Get cart item count
  const getCartItemCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      count += cartItems[itemId].quantity;
    }
    return count;
  };

  // Buy now function (add to cart and proceed to checkout)
  const buyNow = (productId, quantity, scent, medium) => {
    // Add the product to cart
    addToCart(productId, quantity, scent, medium);
    // No need to return anything as navigation is handled by the component
  };

  // Get top selling products (highest rated)
  const getTopSellingProducts = () => {
    return [...products]
      .filter(product => product.rating >= 4.4 && product.rating <= 5.1)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  // Get favorite products
  const getFavoriteProducts = () => {
    return products.filter(product => favorites[product.id]);
  };

  // Search products function
  const searchProducts = (query) => {
    if (!query || query.trim() === '') {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => {
      // Search by name, category, description, scent
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      const descriptionMatch = product.description && product.description.toLowerCase().includes(searchTerm);
      
      // Check if scents array exists and if any scent matches the query
      const scentMatch = product.scents && 
        product.scents.some(scent => scent.toLowerCase().includes(searchTerm));
      
      // Check if medium exists and matches the query
      const mediumMatch = product.medium && 
        product.medium.toLowerCase().includes(searchTerm);

      return nameMatch || categoryMatch || descriptionMatch || scentMatch || mediumMatch;
    });
  };
  
  // Get recommended products based on user favorites or viewed products
  const getRecommendedProducts = (baseProducts, limit = 4) => {
    if (!baseProducts || baseProducts.length === 0) {
      return [];
    }
    
    // Get categories from base products
    const categories = [...new Set(baseProducts.map(product => product.category))];
    
    // Get products from same categories that aren't in the base products
    const baseProductIds = baseProducts.map(p => p.id);
    const recommendations = products.filter(product => 
      categories.includes(product.category) && !baseProductIds.includes(product.id)
    );
    
    // Shuffle and limit results
    return [...recommendations]
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
  };

  // Get recommendations based on favorites
  const getRecommendations = () => {
    // Get categories of favorite products
    const favoriteProducts = getFavoriteProducts();
    const favoriteCategories = [...new Set(favoriteProducts.map(product => product.category))];
    
    // Get 2 random products from each favorite category
    const recommendations = [];
    
    favoriteCategories.forEach(category => {
      const categoryProducts = products.filter(
        product => product.category === category && !favorites[product.id]
      );
      
      // Shuffle and take up to 2 products
      const shuffled = [...categoryProducts].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2);
      
      recommendations.push(...selected);
    });
    
    return recommendations;
  };

  // Clear cart function
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem('cartItems');
  };

  const contextValue = {
    products,
    loading,
    cartItems,
    favorites,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    searchResults,
    setSearchResults,
    searchProducts,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    toggleFavorite,
    getCartTotal,
    getCartItemCount,
    buyNow,
    getTopSellingProducts,
    getProductsByCategory,
    getFavoriteProducts,
    getRecommendations,
    getRecommendedProducts,
    clearCart
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};
