import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeItem,
  updateQuantity,
  selectCartItems,
  selectTotalQuantity,
  selectTotalAmount,
} from './CartSlice';
import './CartItem.css';

const money = (value) => `$${value.toFixed(2)}`;

/**
 * Shopping cart page.
 *
 * Reads the cart out of Redux and dispatches quantity/removal updates, so the
 * navbar badge and every total stay in sync with a single source of truth.
 */
function CartItem({ onContinueShopping }) {
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectTotalQuantity);
  const totalAmount = useSelector(selectTotalAmount);

  // Total cost of one line in the cart: unit price x quantity.
  const calculateTotalCost = (item) => item.cost * item.quantity;

  const handleIncrement = (item) => {
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
    } else {
      // Last one — taking it below 1 removes the plant from the cart.
      dispatch(removeItem(item.name));
    }
  };

  const handleRemove = (item) => dispatch(removeItem(item.name));

  const handleCheckoutShopping = () => {
    setCheckoutMessage('Coming Soon! Online checkout opens next season.');
  };

  const handleContinueShopping = (e) => {
    onContinueShopping(e);
  };

  return (
    <main className="cart-page">
      <header className="cart-header">
        <h1>Your Cart</h1>
        <div className="cart-summary">
          <div className="summary-block">
            <span className="summary-label">Total plants</span>
            <span className="summary-value">{totalQuantity}</span>
          </div>
          <div className="summary-block">
            <span className="summary-label">Total amount</span>
            <span className="summary-value total-amount">{money(totalAmount)}</span>
          </div>
        </div>
      </header>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p className="cart-empty-emoji" aria-hidden="true">
            &#127793;
          </p>
          <h2>Your cart is empty</h2>
          <p>Pick out a plant and it will show up here.</p>
          <button className="continue-shopping-button" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li className="cart-item" key={item.name}>
                <div className="cart-item-thumb">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-details">
                  <h2 className="cart-item-name">{item.name}</h2>
                  <p className="cart-item-description">{item.description}</p>
                  <p className="cart-item-cost">
                    <span className="unit-price">{money(item.cost)}</span> each
                  </p>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button
                      className="quantity-button decrement"
                      onClick={() => handleDecrement(item)}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      &minus;
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-button increment"
                      onClick={() => handleIncrement(item)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-total">{money(calculateTotalCost(item))}</p>

                  <button className="delete-button" onClick={() => handleRemove(item)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <footer className="cart-footer">
            <div className="cart-total-row">
              <span>Total of all items</span>
              <span className="cart-total-value">{money(totalAmount)}</span>
            </div>

            {checkoutMessage && <p className="checkout-message">{checkoutMessage}</p>}

            <div className="cart-actions">
              <button className="continue-shopping-button" onClick={handleContinueShopping}>
                Continue Shopping
              </button>
              <button className="checkout-button" onClick={handleCheckoutShopping}>
                Checkout
              </button>
            </div>
          </footer>
        </>
      )}
    </main>
  );
}

export default CartItem;
