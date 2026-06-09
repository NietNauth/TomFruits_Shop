import { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import ProductCard from '../ProductCard/ProductCard';
import productService from '../../apis/productService';
import categoryService from '../../apis/categoryService';
import aiService from '../../apis/aiService';
import Swal from 'sweetalert2';

export default function AiSuggestModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [foodFilter, setFoodFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [aiMessage, setAiMessage] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    categoryService.getAll().then((res) => {
      setCategories(res.data || []);
    });
  }, []);

  const toggleFood = (title) => {
    setFoodFilter((prev) =>
      prev.includes(title) ? prev.filter((c) => c !== title) : [...prev, title]
    );
  };

  const hasFilter = query.trim() || foodFilter.length > 0 || priceFilter;

  const handleSuggest = async () => {
    if (!hasFilter) return;

    setLoading(true);
    setSearched(false);
    setProducts([]);
    setRecipe('');
    setAiMessage('');

    try {
      let keywords = [];
      let finalProducts = [];
      const q = query.trim();

      // ── BƯỚC 1: XỬ LÝ AI (Promise.race 3.5s timeout) ──────────────────────
      if (q) {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Trợ lý AI phản hồi quá hạn thời gian (3.5 giây).")), 3500)
        );
        const aiResult = await Promise.race([
          aiService.generateSuggestion(q),
          timeoutPromise
        ]);
        setAiMessage(aiResult.ai_response);
        setRecipe(aiResult.recipe);
        keywords = aiResult.search_keywords || [q];
      }

      // ── BƯỚC 2: TÌM KIẾM SẢN PHẨM ──────────────────────────────────────────
      let searchList = [...keywords];
      
      // Nếu không có keywords từ AI, dùng query trực tiếp
      if (searchList.length === 0 && q) searchList = [q];

      const searchPromises = searchList.slice(0, 6).map(kw => 
        productService.getAll({ 
          search: kw, 
          per_page: 5,
          status: 'active' 
        })
      );
      
      const results = await Promise.all(searchPromises);
      results.forEach(res => {
        if (res.data?.data) {
          finalProducts = [...finalProducts, ...res.data.data];
        }
      });

      // Nếu vẫn chưa có sản phẩm nào, thử tìm kiếm từng từ đơn (trừ các từ quá chung chung)
      if (finalProducts.length === 0 && q.length > 2) {
        const words = q.split(' ').filter(w => w.length > 2);
        const fallbackRes = await productService.getAll({ search: words[0], per_page: 5 });
        if (fallbackRes.data?.data) {
          finalProducts = fallbackRes.data.data;
        }
      }


      // Deduplicate
      const uniqueProducts = Array.from(new Map(finalProducts.map(p => [p.id, p])).values());
      
      setProducts(uniqueProducts.slice(0, 8));
      setSearched(true);
    } catch (error) {
      console.error('AI Suggest error:', error);
      Swal.fire({
        title: 'Lỗi trợ lý AI!',
        text: error.message || 'Có lỗi xảy ra khi gọi trợ lý AI. Vui lòng kiểm tra lại!',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Đồng ý'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSuggest();
  };

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>🤖</div>
          <div className={styles.headerText}>
            <p className={styles.headerTitle}>Trợ lý AI - Tom Bot</p>
            <p className={styles.headerSub}>
              Hỏi bất cứ món gì — Tom Bot sẽ tư vấn và chuẩn bị đồ cho bạn
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.searchWrap}>
            <input
              className={styles.searchInput}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              onKeyDown={handleKeyDown}
              placeholder='Bạn muốn nấu món gì hay cần tư vấn gì không?'
            />
            <button className={styles.searchBtn} onClick={handleSuggest}>
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2.5'>
                <path d='m21 21-4.35-4.35' /><circle cx='11' cy='11' r='8' />
              </svg>
            </button>
          </div>

          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>
              <span className={`${styles.filterLabelIcon} ${styles.food}`}>🥦</span>
              Loại thực phẩm
            </div>
            <div className={styles.chips}>
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className={`${styles.chip} ${foodFilter.includes(cat.title) ? styles.activeFood : ''}`}
                  onClick={() => toggleFood(cat.title)}
                >
                  {cat.title}
                </span>
              ))}
            </div>
          </div>


          {loading && (
            <div className={styles.loading}>
               <div className={styles.spinner}></div>
               Tom Bot đang suy nghĩ...
            </div>
          )}

          {!loading && (aiMessage || products.length > 0) && (
            <div className={styles.aiResultArea}>
              <div className={styles.sep} />
              
              {aiMessage && (
                <div className={styles.aiBubble}>
                   <p className={styles.aiText}><strong>Tom Bot:</strong> {aiMessage}</p>
                </div>
              )}

              {recipe && (
                <div className={styles.recipeCard}>
                  <div className={styles.recipeTitle}>📖 Công thức gợi ý</div>
                  <div className={styles.recipeText}>{recipe}</div>
                </div>
              )}

              {products.length > 0 && (
                <>
                  <div className={styles.resultHeader}>
                    <div className={styles.resultDot} />
                    <span className={styles.resultTitle}>Sản phẩm gợi ý cho bạn</span>
                  </div>

                  <div className={styles.productGrid}>
                    {products.map((p) => (
                      <ProductCard
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        category={p.category?.title || p.category}
                        price={p.price}
                        oldPrice={p.old_price}
                        discount={p.discount}
                        tag={p.tag}
                        img={p.image_url}
                        unit={p.unit}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {!loading && searched && products.length === 0 && !aiMessage && (
            <div className={styles.loading}>
              Tom Bot không tìm thấy gì phù hợp. Bạn thử hỏi cách khác nhé!
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.btnPrimary}
            onClick={handleSuggest}
            disabled={loading || !hasFilter}
          >
            ✨ {loading ? 'Đang suy nghĩ...' : 'Hỏi trợ lý'}
          </button>
          <button className={styles.btnSecondary} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
