import styles from './styles.module.scss';
import { FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../utils/cart';
function ProductCard({
  id,
  name,
  category,
  price,
  oldPrice,
  discount,
  tag,
  img,
  unit,
  status,
  stock,
}) {
  const navigate = useNavigate();
  const {
    card,
    imageWrap,
    tag: tagClass,
    discount: discountClass,
    heart,
    contentBox,
    categoryText,
    content,
    unitText,
    bottom,
    priceText,
    soldOutOverlay,
    oldPriceText,
    btn,
  } = styles;

  const isSoldOut = status === 'out_of_stock';

  const formatPrice = (value) => {
    if (!value) return '0';
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className={card} onClick={() => navigate(`/products/${id}`)}>
      <div className={imageWrap}>
        <img 
          src={img} 
          alt={name} 
          style={{ filter: isSoldOut ? 'grayscale(0.8)' : 'none' }} 
          onError={(e) => { e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22300%22%20viewBox%3D%220%200%20300%20300%22%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239ca3af%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E'; }}
        />
        {isSoldOut && (
          <div className={soldOutOverlay}>
            <span>Hết hàng</span>
          </div>
        )}
        {tag && <span className={tagClass}>{tag}</span>}
        {discount > 0 && <span className={discountClass}>-{discount}%</span>}
        <div className={heart}>
          <FaRegHeart />
        </div>
      </div>

      <div className={contentBox}>
        <div className={categoryText}>{category}</div>
        <div className={content}>{name}</div>

        <div className={unitText}>Đơn vị: {unit}</div>

        <div className={bottom}>
          <div>
            <div className={priceText}>
              {formatPrice(price)}đ
            </div>
            {oldPrice && (
              <div className={oldPriceText}>
                {formatPrice(oldPrice)}đ
              </div>
            )}
          </div>

          <button
            className={btn}
            disabled={isSoldOut}
            style={{ 
              opacity: isSoldOut ? 0.5 : 1, 
              cursor: isSoldOut ? 'not-allowed' : 'pointer',
              background: isSoldOut ? '#999' : '#16a34a'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isSoldOut) return;
              addToCart({ id, name, price, img, unit, quantity: 1, stock: stock || 999 });
            }}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
