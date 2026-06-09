import { storage } from './storage';
import cartService from '../apis/cartService';
import Swal from 'sweetalert2';

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
      const stock = product.stock || 999;

      if (existing) {
        const newQty = (existing.quantity || 1) + qtyToAdd;
        if (newQty > stock) {
          Swal.fire({
            title: 'Hết hàng!',
            text: `Số lượng sản phẩm vượt quá tồn kho hiện tại (Tối đa còn lại: ${stock})`,
            icon: 'warning',
            confirmButtonText: 'Đồng ý',
            confirmButtonColor: '#f59e0b',
          });
          return;
        }
        existing.quantity = newQty;
      } else {
        if (qtyToAdd > stock) {
          Swal.fire({
            title: 'Hết hàng!',
            text: `Số lượng sản phẩm vượt quá tồn kho hiện tại (Tối đa còn lại: ${stock})`,
            icon: 'warning',
            confirmButtonText: 'Đồng ý',
            confirmButtonColor: '#f59e0b',
          });
          return;
        }
        cart.push({ ...product, quantity: qtyToAdd });
      }
      storage.setCart(cart);
    }

    window.dispatchEvent(new Event('cartUpdated'));
    console.log('Event cartUpdated dispatched');
    Swal.fire({
      title: 'Đã thêm vào giỏ hàng!',
      text: `Đã thêm thành công ${product.name} vào giỏ hàng của bạn.`,
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xem giỏ hàng',
      cancelButtonText: 'Tiếp tục mua sắm',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/cart';
      }
    });
  } catch (err) {
    console.error('Thêm giỏ hàng thất bại:', err);
    Swal.fire({
      title: 'Thất bại!',
      text: 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!',
      icon: 'error',
      confirmButtonText: 'Đồng ý',
      confirmButtonColor: '#ef4444',
    });
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
