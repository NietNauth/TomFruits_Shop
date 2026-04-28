import useScrollHandling from '../../hooks/useScrollHandling';
import { dataMenu } from './constants';
import Menu from './Menu/Menu';
import styles from './styles.module.scss';
import logo from '@icons/images/logo.png';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { storage } from '../../utils/storage';
import productService from '../../apis/productService';
import { removeFromCart as removeUtility } from '../../utils/cart';
import cartService from '../../apis/cartService';
import { X, ChevronRight, Search } from 'lucide-react';

function MyHeader() {
  const {
    container,
    containerMenu,
    containerHeader,
    left,
    right,
    center,
    searchBox,
    fixedHeader,
    topHeader,
  } = styles;
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const { scrollPosition } = useScrollHandling();
  const [fixedPosition] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search logic
  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setShowSuggestions(true);
      try {
        const res = await productService.getAll({ search: keyword.trim(), per_page: 5 });
        setSuggestions(res.data?.data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const fmt = (n) => Math.round(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ';

  const getFullImgUrl = (img) => {
    if (!img) return 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22150%22%20viewBox%3D%220%200%20150%20150%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239ca3af%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%3ENo%20Img%3C%2Ftext%3E%3C%2Fsvg%3E';
    return img.startsWith('http') ? img : `http://localhost:8000/storage/${img}`;
  };

  useEffect(() => {
    const updateCount = async () => {
      if (isLoggedIn) {
        try {
          const res = await cartService.getCart();
          const items = res.data.map(item => ({
            id: item.product_id, // productId
            cartItemId: item.id, // primary key in cart table
            name: item.product.name,
            price: item.product.price,
            img: item.product.img,
            quantity: item.quantity,
            unit: item.product.unit
          }));
          setCartItems(items);
          setTotalQuantity(items.reduce((sum, item) => sum + (item.quantity || 1), 0));
        } catch (err) {
          console.error('Fetch cart error:', err);
        }
      } else {
        const cart = storage.getCart();
        setCartItems(cart);
        setTotalQuantity(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
      }
    };
    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    return () => window.removeEventListener('cartUpdated', updateCount);
  }, [isLoggedIn]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRemove = async (id, cartItemId) => {
    await removeUtility(id, cartItemId);
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };
  const handleClick = (e) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (location.pathname !== '/') {
        // Nếu đang ở trang khác, về home rồi scroll
        navigate('/');
        setTimeout(() => {
          document
            .getElementById(href.slice(1))
            ?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document
          .getElementById(href.slice(1))
          ?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  return (
    <div
      className={classNames(container, topHeader, {
        [fixedHeader]: fixedPosition,
      })}
    >
      <div className={`${container} ${fixedHeader}`}>
        <div className={containerHeader}>
          {/* BÊN TRÁI */}
          <div className={left}>
            <img
              src={logo}
              alt='logo'
              style={{
                width: '170px',
                height: '53px',
              }}
            />
            <div className={containerMenu}>
              {dataMenu.slice(0, 4).map((item) => (
                <Menu
                  key={item.content}
                  content={item.content}
                  href={item.href}
                />
              ))}
            </div>
          </div>

          <div className={center}>
            <div className={searchBox}>
              <input
                type='text'
                placeholder='Tìm kiếm sản phẩm...'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => keyword.trim() && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <button onClick={handleSearch}>
                <Search size={18} />
              </button>
            </div>

            {/* SUGGESTIONS DROPDOWN */}
            {showSuggestions && (
              <div className={styles.suggestionsDropdown}>
                <div className={styles.dropdownHeader}>Kết quả cho "{keyword}"</div>
                {isSearching ? (
                  <div className={styles.loading}>Đang tìm kiếm...</div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <div
                      key={item.id}
                      className={styles.suggestionItem}
                      onClick={() => {
                        navigate(`/products/${item.id}`);
                        setShowSuggestions(false);
                        setKeyword('');
                      }}
                    >
                      <img
                        src={getFullImgUrl(item.img)}
                        alt={item.name}
                        className={styles.prodImg}
                      />
                      <div className={styles.prodInfo}>
                        <span className={styles.name}>{item.name}</span>
                        <span className={styles.price}>{fmt(item.price)}</span>
                      </div>
                      <ChevronRight className={styles.viewArrow} size={16} />
                    </div>
                  ))
                ) : (
                  <div className={styles.noResult}>
                    <div className={styles.icon}>🔍</div>
                    <span>Không tìm thấy sản phẩm <strong>"{keyword}"</strong></span>
                  </div>
                )}
                {suggestions.length > 0 && !isSearching && (
                  <div 
                    className={styles.viewAll}
                    onClick={() => {
                      handleSearch();
                      setShowSuggestions(false);
                    }}
                  >
                    Xem tất cả ({suggestions.length} kết quả)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BÊN PHẢI */}
          <div className={right}>
            <div 
              className={styles.cart} 
              onMouseEnter={() => setShowCartDropdown(true)}
              onMouseLeave={() => setShowCartDropdown(false)}
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart />
              <span className={styles.badge}>{totalQuantity}</span>

              {/* CART DROPDOWN */}
              {showCartDropdown && (
                <div className={styles.cartDropdown} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.cartHeader}>Giỏ hàng của tôi</div>
                  
                  <div className={styles.cartList}>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div 
                          key={item.id} 
                          className={styles.cartItem}
                          onClick={() => {
                            navigate(`/products/${item.id}`);
                            setShowCartDropdown(false);
                          }}
                        >
                          <img src={getFullImgUrl(item.img)} alt={item.name} />
                          <div className={styles.itemInfo}>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemMeta}>x{item.quantity} {item.unit}</span>
                            <span className={styles.itemPrice}>{fmt(item.price)}</span>
                          </div>
                          <button 
                            className={styles.removeItem}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item.id, item.cartItemId);
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className={styles.cartEmpty}>Chưa có sản phẩm nào trong giỏ</div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className={styles.cartFooter}>
                      <div className={styles.subtotal}>
                        <span>Tổng tiền:</span>
                        <span>{fmt(subtotal)}</span>
                      </div>
                      <div className={styles.actions}>
                        <button 
                          className={styles.viewCart}
                          onClick={() => {
                            navigate('/cart');
                            setShowCartDropdown(false);
                          }}
                        >
                          Giỏ hàng
                        </button>
                        <button 
                          className={styles.checkout}
                          onClick={() => {
                            navigate('/checkout');
                            setShowCartDropdown(false);
                          }}
                        >
                          Thanh toán
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {user ? (
              <div
                className={styles.userBox}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className={styles.avatar}>{user.name.charAt(0)}</div>
                <span className={styles.username}>{user.name}</span>

                {showDropdown && (
                  <div className={styles.dropdown}>
                    <div className={styles.info}>
                      <strong>{user.name}</strong>
                      <p>{user.email}</p>
                    </div>

                    <div
                      className={styles.item}
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/profile');
                      }}
                    >
                      Quản lý tài khoản
                    </div>

                    <div
                      className={styles.logout}
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                    >
                      Đăng xuất
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Menu content='Đăng nhập' className={styles.noHover} />
                <Link to='/register'>
                  <button className={styles.btnRegister}>Đăng ký</button>
                </Link>
              </>
            )}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyHeader;
