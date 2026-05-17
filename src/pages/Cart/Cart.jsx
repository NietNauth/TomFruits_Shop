import CartContent from './CardContent/CardContent';
import EmptyCard from './EmptyCard/EmptyCart';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import cartService from '../../apis/cartService';

function Cart() {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (isLoggedIn) {
          const res = await cartService.getCart();
          const items = res.data.map((item) => ({
            id: item.product_id,
            cartItemId: item.id,
            name: item.product.name,
            price: item.product.price,
            img: item.product.image_url,
            quantity: item.quantity,
            stock: item.product.quantity,
          }));
          setCartItems(items);
        } else {
          setCartItems(JSON.parse(localStorage.getItem('cart')) || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
    
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isLoggedIn]);

  if (isLoading) return <div style={{padding: 50, textAlign: 'center'}}>Đang tải giỏ hàng...</div>;

  return (
    <div>
      {cartItems.length === 0 ? (
        <EmptyCard />
      ) : (
        <CartContent cartItems={cartItems} setCartItems={setCartItems} />
      )}
    </div>
  );
}

export default Cart;
