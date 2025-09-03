import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // ✅ Load cart from localStorage when app starts
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  }, []);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart:", err);
    }
  }, [cart]);

  // ✅ Add item to cart
const addToCart = (item) => {
  setCart((prevCart) => {
    const existing = prevCart.find((p) => p._id === item._id);
    if (existing) {
      // ✅ If item already exists, just update quantity
      return prevCart.map((p) =>
        p._id === item._id
          ? { ...p, quantity: p.quantity + (item.quantity || 1) } // fallback to 1
          : p
      );
    }
    // Always ensure quantity exists
    return [...prevCart, { ...item, quantity: item.quantity || 1 }];
  });
};


  // ✅ Update item quantity
  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, quantity: qty } : i))
    );
  };

  // ✅ Remove item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  // ✅ Clear cart (after order placed)
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
