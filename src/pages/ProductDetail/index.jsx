import MyFooter from '../../components/Footer/Footer';
import MyHeader from '../../components/Header/Header';
import MainLayout from '../../layouts/Layout/Layout';
import ProductCard from '../../components/ProductCard/ProductCard';
import productService from '../../apis/productService';
import styles from './styles.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { addToCart } from '../../utils/cart';

import {
  FaRegHeart,
  FaShoppingCart,
  FaShieldAlt,
  FaTruck,
  FaUndoAlt,
} from 'react-icons/fa';

function DetailProduct() {
  const {
    container,
    navigateSection,
    contentSection,
    imageBox,
    infoBox,
    qtyWrapper,
    qtyLabel,
    qtyBox,
    features,
    tabs,
    tabContent,
    tabHeader,
    active,
    related,
  } = styles;
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await productService.getById(id);
        setProduct(productRes.data);
        if (productRes.data?.category_id) {
          const relatedRes = await productService.getByCategory(productRes.data.category_id);
          setRelatedProducts(relatedRes.data?.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const [qty, setQty] = useState(1);
  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        product,
        quantity: qty,
      },
    });
  };
  const [activeTab, setActiveTab] = useState('desc');
  if (isLoading)
    return (
      <div>
        <MyHeader />
        <h2 style={{ padding: 50, textAlign: 'center' }}>Đang tải...</h2>
        <MyFooter />
      </div>
    );
  if (!product)
    return (
      <div>
        <MyHeader />
        <h2 style={{ padding: 50 }}>Không tìm thấy sản phẩm</h2>
        <MyFooter />
      </div>
    );
  
  const imgUrl = product.image_url;
  return (
    <div>
      <MyHeader />
      <MainLayout>
        <div className={container}>
          <div className={navigateSection}>
            <div>
              Trang chủ {'>'} Sản phẩm {'>'} {product.name}
            </div>
          </div>

          <div className={contentSection} style={{ opacity: product.status === 'out_of_stock' ? 0.8 : 1 }}>
            <div className={imageBox}>
              <img src={imgUrl} alt={product.name} style={{ filter: product.status === 'out_of_stock' ? 'grayscale(0.8)' : 'none' }} />
              {product.status === 'out_of_stock' && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(255,255,255,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}>
                  <span style={{
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '10px 30px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '20px'
                  }}>Hết hàng</span>
                </div>
              )}
              {product.discount > 0 && (
                <>
                  {product.tag && (
                    <span className={styles.tag}>{product.tag}</span>
                  )}
                  <span
                    className={styles.discount}
                    style={{ top: product.tag ? '50px' : '15px' }}
                  >
                    -{product.discount}%
                  </span>
                </>
              )}
              <div className={styles.heart}>
                <FaRegHeart />
              </div>
            </div>
            <div className={infoBox}>
              <h1>{product.name}</h1>
              <div className={styles.price}>
                <div className={styles.currentPrice}>
                  <h2>{Math.round(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</h2>
                  <span>/ {product.unit}</span>
                </div>

                {product.old_price && (
                  <div className={styles.priceSub}>
                    <span className={styles.oldPrice}>
                      {Math.round(product.old_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ
                    </span>
                    <span className={styles.save}>
                      Tiết kiệm{' '}
                      {Math.round(product.old_price - product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ
                    </span>
                  </div>
                )}
              </div>
              <div className={qtyWrapper}>
                <p className={qtyLabel}>Số lượng</p>
                <div className={qtyBox}>
                  <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} disabled={product.status === 'out_of_stock'}>
                    -
                  </button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} disabled={product.status === 'out_of_stock'}>+</button>
                </div>
              </div>
              <p className={styles.totalBar}>
                Tổng tiền:{' '}
                <b>{Math.round(product ? product.price * qty : 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</b>
              </p>

              {/* BUTTON */}
              <div className={styles.btn}>
                <button
                  className={styles.btnPrimary}
                  disabled={product.status === 'out_of_stock'}
                  style={{ 
                    background: product.status === 'out_of_stock' ? '#999' : '#16a34a',
                    cursor: product.status === 'out_of_stock' ? 'not-allowed' : 'pointer',
                    opacity: product.status === 'out_of_stock' ? 0.7 : 1
                  }}
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      img: imgUrl,
                      unit: product.unit,
                      quantity: qty,
                    })
                  }
                >
                  <FaShoppingCart />
                  {product.status === 'out_of_stock' ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>
                <button 
                  className={styles.btnOutline} 
                  disabled={product.status === 'out_of_stock'}
                  style={{ 
                    cursor: product.status === 'out_of_stock' ? 'not-allowed' : 'pointer',
                    opacity: product.status === 'out_of_stock' ? 0.7 : 1
                  }}
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </button>
              </div>
              <div className={features}>
                <span>
                  <FaShieldAlt />
                  Chính hãng
                </span>
                <span>
                  <FaTruck />
                  Giao nhanh
                </span>
                <span>
                  <FaUndoAlt />
                  Đổi trả
                </span>
              </div>
            </div>
          </div>
          <div className={tabs}>
            <div className={tabHeader}>
              <span
                className={activeTab === 'desc' ? active : ''}
                onClick={() => setActiveTab('desc')}
              >
                {' '}
                Mô tả sản phẩm
              </span>
              <span
                className={activeTab === 'nutri' ? active : ''}
                onClick={() => setActiveTab('nutri')}
              >
                Thông tin dinh dưỡng
              </span>
            </div>

            <div className={tabContent}>
              {activeTab === 'desc' && (
                <div 
                  className={styles.richText}
                  dangerouslySetInnerHTML={{ __html: product?.description }} 
                />
              )}
              {activeTab === 'nutri' && (
                <div className={styles.nutriBox}>
                  {product?.nutritional_info ? (
                    <div 
                      className={styles.richText}
                      dangerouslySetInnerHTML={{ __html: product.nutritional_info }} 
                    />
                  ) : (
                    <p>Chưa có thông tin dinh dưỡng.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={related}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Sản phẩm liên quan</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', 
              gap: '20px' 
            }}>
              {relatedProducts.slice(0, 4).map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  category={item.category?.title || 'Chưa phân loại'}
                  price={item.price}
                  oldPrice={item.old_price}
                  discount={item.discount}
                  tag={item.tag}
                  img={item.image_url}
                  unit={item.unit}
                  status={item.status}
                />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
      <MyFooter />
    </div>
  );
}

export default DetailProduct;
