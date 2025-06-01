import React, { useState, useEffect } from 'react';
import '../../styles/HeroSection.css';

const heroImages = [
  {
    src: '/src/assets/candles-img/Clear_Glass_Candle_Large.JPG',
    alt: 'Luxury candle collection',
    title: 'Luxury Candle Collection',
    subtitle: 'Elevate your space with our premium candles'
  },
  {
    src: '/src/assets/diffusers-img/Reed_Diffuser_Large.JPG',
    alt: 'Reed diffuser collection',
    title: 'Reed Diffuser Collection',
    subtitle: 'Long-lasting fragrance for your home'
  },
  {
    src: '/src/assets/furniture-img/Mushroom_Chair.jpg',
    alt: 'Unique furniture pieces',
    title: 'Statement Furniture',
    subtitle: 'Unique pieces that define your space'
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-container">
      {heroImages.map((image, index) => (
        <div 
          key={index} 
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image.src})` }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{image.title}</h1>
            <p className="hero-subtitle">{image.subtitle}</p>
          </div>
        </div>
      ))}
      
      <div className="slide-indicators">
        {heroImages.map((_, index) => (
          <button 
            key={index} 
            className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};





export default HeroSection;
