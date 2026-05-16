import { storage } from './storage';
import cartService from '../apis/cartService';

/**
 * Thêm sản phẩm vào giỏ hàng
 * - Nếu đã đăng nhập: gọi API cart
 * - Nếu chưa đăng nhập: lưu localStorage như cũ
 */
export const addToCart = async (product) => {
  console.log('--- addToCart called ---', product);
  try {
    const qtyToAdd = product.quantity || 1;

    if (storage.isLoggedIn()) {
      console.log('Logged in mode. Calling API...');
      await cartService.addItem(product.id, qtyToAdd);
    } else {
      console.log('Guest mode. Saving to localStorage...');
      const cart = storage.getCart();
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + qtyToAdd;
      } else {
        cart.push({ ...product, quantity: qtyToAdd });
      }
      storage.setCart(cart);
    }

    window.dispatchEvent(new Event('cartUpdated'));
    console.log('Event cartUpdated dispatched');
  } catch (err) {
    console.error('Thêm giỏ hàng thất bại:', err);
    toast.error('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!');
  }
};

/**
 * Xóa item khỏi giỏ (localStorage hoặc Server)
 */
export const removeFromCart = async (productId, cartItemId = null) => {
  if (storage.isLoggedIn() && cartItemId) {
    try {
      await cartService.removeItem(cartItemId);
    } catch (err) {
      console.error('Xóa item thất bại:', err);
    }
  } else {
    // Local fallback
    const cart = storage.getCart().filter((item) => item.id !== productId);
    storage.setCart(cart);
  }
  window.dispatchEvent(new Event('cartUpdated'));
};

/**
 * Cập nhật số lượng item (localStorage hoặc Server)
 */
export const updateCartQuantity = async (
  productId,
  quantity,
  cartItemId = null
) => {
  if (storage.isLoggedIn() && cartItemId) {
    try {
      await cartService.updateItem(cartItemId, quantity);
    } catch (err) {
      console.error('Cập nhật số lượng thất bại:', err);
    }
  } else {
    // Local fallback
    const cart = storage
      .getCart()
      .map((item) => (item.id === productId ? { ...item, quantity } : item));
    storage.setCart(cart);
  }
  window.dispatchEvent(new Event('cartUpdated'));
};

/**
 * Xóa toàn bộ giỏ hàng
 */
export const clearCart = () => {
  storage.clearCart();
  window.dispatchEvent(new Event('cartUpdated'));
};
