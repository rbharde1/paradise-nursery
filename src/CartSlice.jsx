import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux slice holding the shopping cart.
 *
 * Each entry in `items` is a plant plus the quantity the shopper has chosen:
 *   { name, image, cost, description, quantity }
 *
 * `cost` is stored as a number so totals never depend on parsing a "$12.00"
 * string back into a value.
 */
export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    // Adds a plant to the cart, or bumps its quantity if it is already there.
    addItem: (state, action) => {
      const { name, image, cost, description } = action.payload;
      const existingItem = state.items.find((item) => item.name === name);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ name, image, cost, description, quantity: 1 });
      }
    },

    // Removes a plant from the cart entirely. Accepts either the plant name
    // or the whole item object as the payload.
    removeItem: (state, action) => {
      const name = action.payload?.name ?? action.payload;
      state.items = state.items.filter((item) => item.name !== name);
    },

    // Sets an exact quantity for a plant. Dropping to zero removes it.
    updateQuantity: (state, action) => {
      const { name, quantity } = action.payload;
      const itemToUpdate = state.items.find((item) => item.name === name);

      if (!itemToUpdate) return;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.name !== name);
      } else {
        itemToUpdate.quantity = quantity;
      }
    },

    // Empties the cart (used by the checkout flow).
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = CartSlice.actions;

/* ---------- selectors ---------- */

export const selectCartItems = (state) => state.cart.items;

// Total number of plants in the cart, counting quantities.
export const selectTotalQuantity = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

// Total cost of everything in the cart.
export const selectTotalAmount = (state) =>
  state.cart.items.reduce((total, item) => total + item.cost * item.quantity, 0);

export default CartSlice.reducer;
