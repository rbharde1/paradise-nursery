import { useState } from 'react';
import AboutUs from './AboutUs';
import ProductList from './ProductList';
import './App.css';

/**
 * Paradise Nursery — landing page.
 *
 * Holds the one piece of navigation state the app needs: whether the shopper
 * is still on the landing page or has moved into the shop. ProductList takes
 * over from there and handles switching between the plant list and the cart.
 */
function App() {
  const [showProductList, setShowProductList] = useState(false);

  const handleGetStartedClick = () => setShowProductList(true);
  const handleHomeClick = () => setShowProductList(false);

  return (
    <div className="app-container">
      <div className={`landing-page ${showProductList ? 'fade-out' : ''}`}>
        <div className="background-image" />

        <div className="landing-content">
          <div className="landing-intro">
            <p className="eyebrow">Houseplants, delivered</p>
            <h1 className="company-name">Paradise Nursery</h1>
            <div className="divider" />
            <p className="tagline">Where green meets serenity</p>
            <button className="get-started-button" onClick={handleGetStartedClick}>
              Get Started
            </button>
          </div>

          <div className="aboutus-container">
            <AboutUs />
          </div>
        </div>
      </div>

      <div className={`product-list-container ${showProductList ? 'visible' : ''}`}>
        <ProductList onHomeClick={handleHomeClick} />
      </div>
    </div>
  );
}

export default App;
