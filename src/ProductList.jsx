import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import { addItem, selectCartItems, selectTotalQuantity } from './CartSlice';
import './ProductList.css';

// Thumbnails live in public/images. BASE_URL keeps them working when the site
// is deployed to a GitHub Pages sub-path.
const img = (file) => `${import.meta.env.BASE_URL}images/${file}`;

/**
 * The shop's catalogue: three categories, six unique houseplants in each.
 * `cost` is a number so cart totals never depend on parsing a currency string.
 */
const plantsArray = [
  {
    category: 'Air Purifying Plants',
    blurb: 'Filter the air while they sit on the shelf.',
    plants: [
      {
        name: 'Snake Plant',
        image: img('snake-plant.svg'),
        cost: 15.0,
        description: 'Nearly unkillable, and it scrubs the air overnight.',
      },
      {
        name: 'Spider Plant',
        image: img('spider-plant.svg'),
        cost: 12.0,
        description: 'Arching stripes and free baby plants all summer.',
      },
      {
        name: 'Peace Lily',
        image: img('peace-lily.svg'),
        cost: 18.0,
        description: 'White blooms that tell you when they need water.',
      },
      {
        name: 'Boston Fern',
        image: img('boston-fern.svg'),
        cost: 14.0,
        description: 'A soft green cloud that loves a humid bathroom.',
      },
      {
        name: 'Rubber Plant',
        image: img('rubber-plant.svg'),
        cost: 22.0,
        description: 'Deep burgundy leaves with a high-gloss finish.',
      },
      {
        name: 'Aloe Vera',
        image: img('aloe-vera.svg'),
        cost: 11.0,
        description: 'A windowsill first-aid kit that asks for nothing.',
      },
    ],
  },
  {
    category: 'Low Maintenance Plants',
    blurb: 'For the forgetful, the busy, and the frequently away.',
    plants: [
      {
        name: 'ZZ Plant',
        image: img('zz-plant.svg'),
        cost: 19.0,
        description: 'Thrives on neglect and low light. Genuinely.',
      },
      {
        name: 'Pothos',
        image: img('pothos.svg'),
        cost: 10.0,
        description: 'Trails for metres and roots from any cutting.',
      },
      {
        name: 'Cast Iron Plant',
        image: img('cast-iron-plant.svg'),
        cost: 16.0,
        description: 'Named for what it survives. Dark corners welcome.',
      },
      {
        name: 'Jade Plant',
        image: img('jade-plant.svg'),
        cost: 13.0,
        description: 'A little succulent tree that lives for decades.',
      },
      {
        name: 'Chinese Evergreen',
        image: img('chinese-evergreen.svg'),
        cost: 17.0,
        description: 'Painterly pink and silver leaves, zero fuss.',
      },
      {
        name: 'Heartleaf Philodendron',
        image: img('philodendron.svg'),
        cost: 15.0,
        description: 'Fast, forgiving vines for a shelf or a hook.',
      },
    ],
  },
  {
    category: 'Statement Plants',
    blurb: 'Floor-standing plants that anchor a whole room.',
    plants: [
      {
        name: 'Monstera Deliciosa',
        image: img('monstera.svg'),
        cost: 28.0,
        description: 'The split-leaf classic. Grows into the space you give it.',
      },
      {
        name: 'Fiddle Leaf Fig',
        image: img('fiddle-leaf-fig.svg'),
        cost: 35.0,
        description: 'Sculptural, dramatic, and worth the attention it needs.',
      },
      {
        name: 'Bird of Paradise',
        image: img('bird-of-paradise.svg'),
        cost: 42.0,
        description: 'Paddle leaves two feet across. Instant tropics.',
      },
      {
        name: 'Majesty Palm',
        image: img('majesty-palm.svg'),
        cost: 26.0,
        description: 'Feathered fronds that soften a hard corner.',
      },
      {
        name: 'Dracaena Marginata',
        image: img('dracaena.svg'),
        cost: 24.0,
        description: 'Thin red-edged blades on a slender trunk.',
      },
      {
        name: 'Parlor Palm',
        image: img('parlor-palm.svg'),
        cost: 21.0,
        description: 'A Victorian favourite that still tolerates low light.',
      },
    ],
  },
];

/** Cart glyph used in the navbar. */
function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
      <path
        d="M3 4h2.2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.55L21 8H6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Product listing page, plus the navbar shared with the cart page.
 *
 * `showCart` decides whether the plant grid or <CartItem /> is on screen;
 * `onHomeClick` hands navigation back to App for the landing page.
 */
function ProductList({ onHomeClick }) {
  const [showCart, setShowCart] = useState(false);
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectTotalQuantity);

  // Derived from the store, so the button re-enables if the plant is later
  // deleted from the cart.
  const isInCart = (name) => cartItems.some((item) => item.name === name);

  const handleAddToCart = (plant) => dispatch(addItem(plant));

  const handleHomeClick = (e) => {
    e.preventDefault();
    setShowCart(false);
    onHomeClick();
  };

  const handlePlantsClick = (e) => {
    e.preventDefault();
    setShowCart(false);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setShowCart(true);
  };

  return (
    <div className="shop">
      {/* Navbar — shown on both the product listing page and the cart page. */}
      <nav className="navbar">
        <a href="#home" className="navbar-brand" onClick={handleHomeClick}>
          <span className="navbar-logo" aria-hidden="true">
            &#127793;
          </span>
          <span className="navbar-brand-text">
            <strong>Paradise Nursery</strong>
            <em>Where green meets serenity</em>
          </span>
        </a>

        <div className="navbar-links">
          <a href="#home" className="nav-link" onClick={handleHomeClick}>
            Home
          </a>
          <a
            href="#plants"
            className={`nav-link ${showCart ? '' : 'active'}`}
            onClick={handlePlantsClick}
          >
            Plants
          </a>
          <a
            href="#cart"
            className={`nav-link cart-link ${showCart ? 'active' : ''}`}
            onClick={handleCartClick}
            aria-label={`Cart, ${totalQuantity} items`}
          >
            <CartIcon />
            <span className="cart-count">{totalQuantity}</span>
          </a>
        </div>
      </nav>

      {showCart ? (
        <CartItem onContinueShopping={handlePlantsClick} />
      ) : (
        <main className="product-page">
          <header className="product-page-header">
            <h1>Our Plants</h1>
            <p>Eighteen houseplants, grown on site and ready for your window.</p>
          </header>

          {plantsArray.map((section) => (
            <section className="plant-category" key={section.category}>
              <div className="plant-category-header">
                <h2>{section.category}</h2>
                <p>{section.blurb}</p>
              </div>

              <div className="product-grid">
                {section.plants.map((plant) => {
                  const added = isInCart(plant.name);

                  return (
                    <article className="product-card" key={plant.name}>
                      <div className="product-thumb">
                        <img src={plant.image} alt={plant.name} loading="lazy" />
                      </div>

                      <div className="product-body">
                        <h3 className="product-title">{plant.name}</h3>
                        <p className="product-description">{plant.description}</p>
                        <p className="product-price">${plant.cost.toFixed(2)}</p>

                        <button
                          className={`add-to-cart-button ${added ? 'added' : ''}`}
                          onClick={() => handleAddToCart(plant)}
                          disabled={added}
                        >
                          {added ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      )}
    </div>
  );
}

export default ProductList;
