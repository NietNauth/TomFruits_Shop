import MyFooter from '../../components/Footer/Footer';
import MyHeader from '../../components/Header/Header';
import styles from './styles.module.scss';
import productService from '../../apis/productService';
import categoryService from '../../apis/categoryService';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';

const PAGE_SIZE = 12;

function ProductListPage() {
  const { container, sidebar, main, header, active, list, headerLeft } = styles;
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  
  const keywordFromUrl = params.get('keyword') || params.get('search') || '';
  const categoryFromUrlRaw = params.get('category');
  const categoryFromUrl = categoryFromUrlRaw ? decodeURIComponent(categoryFromUrlRaw) : '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: keywordFromUrl, category_id: categoryFromUrl, page: 1, sort: 'default' });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  // Load danh mục
  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data?.data || res.data || []));
  }, []);

  // Sync params từ url
  useEffect(() => {
    if (categoryFromUrl || keywordFromUrl) {
      setFilters((f) => ({ ...f, category_id: categoryFromUrl, search: keywordFromUrl, page: 1 }));
    }
  }, [categoryFromUrl, keywordFromUrl]);

  // Load sản phẩm
  useEffect(() => {
    productService.getAll(filters).then((res) => {
      setProducts(res.data?.data || []);
      const total = res.data?.total || 0;
      const perPage = res.data?.per_page || PAGE_SIZE;
      setPagination({ 
        current_page: res.data?.current_page || 1, 
        last_page: res.data?.last_page || Math.ceil(total / perPage) || 1
      });
    }).catch(console.error);
  }, [filters]);

  const [price, setPrice] = useState({ min: 0, max: 500000 });

  const selectedCategory = filters.category_id || 'Tất cả';
  const currentPage = pagination.current_page;
  const totalPages = pagination.last_page;

  const handleCategoryFilter = (catId) => {
    setFilters((f) => ({ ...f, category_id: catId, page: 1 }));
    if (catId) {
      navigate(`/products?category=${encodeURIComponent(catId)}`);
    } else {
      navigate(`/products`);
    }
  };

  return (
    <>
      <MyHeader />
      <div className={container}>
        {/* HEADER */}
        <div className={header}>
          <div className={headerLeft}>
            <h2>Danh sách sản phẩm</h2>
          </div>
          <div className={styles.sortBox}>
            <span>SẮP XẾP THEO:</span>
            <select
              className={styles.select}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
              value={filters.sort}
            >
              <option value='default'>Mặc định</option>
              <option value='low'>Giá thấp</option>
              <option value='high'>Giá cao</option>
              <option value='name-asc'>Tên A-Z</option>
              <option value='name-desc'>Tên Z-A</option>
            </select>
          </div>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          {/* SIDEBAR */}
          <div className={sidebar}>
            <div className={styles.categoryBox}>
              <h4>Danh mục</h4>
              <ul>
                <li
                  className={selectedCategory === 'Tất cả' || !selectedCategory ? active : ''}
                  onClick={() => handleCategoryFilter('')}
                >
                  <span>Tất cả</span>
                </li>

                {categories.map((item) => (
                  <li
                    key={item.id}
                    className={selectedCategory == item.id || selectedCategory == item.title ? active : ''}
                    onClick={() => handleCategoryFilter(item.id)}
                  >
                    <span>{item.title || item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* PRICE FILTER - Có thể không gọi API mà filter local cho vui, hoặc gửi lên API */}
            <div className={styles.priceBox}>
              <h4>Khoảng giá</h4>
              <div className={styles.inputs}>
                <input value={`${price.min.toLocaleString()}đ`} readOnly />
                <input value={`${price.max.toLocaleString()}đ`} readOnly />
              </div>

              <div className={styles.slider}>
                <input
                  type='range'
                  className={styles.min}
                  min='0'
                  max='500000'
                  value={price.min}
                  onChange={(e) =>
                    setPrice({
                      ...price,
                      min: Math.min(+e.target.value, price.max - 1000),
                    })
                  }
                  onMouseUp={() => setFilters(f => ({...f, min_price: price.min, max_price: price.max, page: 1}))}
                />
                <input
                  type='range'
                  className={styles.max}
                  min='0'
                  max='500000'
                  value={price.max}
                  onChange={(e) =>
                    setPrice({
                      ...price,
                      max: Math.max(+e.target.value, price.min + 1000),
                    })
                  }
                  onMouseUp={() => setFilters(f => ({...f, min_price: price.min, max_price: price.max, page: 1}))}
                />
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className={main}>
            {/* PRODUCT LIST */}
            <div className={list}>
              {products.length > 0 ? (
                products.map((item) => (
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
                ))
              ) : (
                <p>Không có sản phẩm nào</p>
              )}
            </div>
            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setFilters({ ...filters, page: Math.max(filters.page - 1, 1) })}
                  disabled={currentPage === 1}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                      onClick={() => setFilters({ ...filters, page })}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className={styles.pageBtn}
                  onClick={() =>
                    setFilters({ ...filters, page: Math.min(filters.page + 1, totalPages) })
                  }
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MyFooter />
    </>
  );
}

export default ProductListPage;
