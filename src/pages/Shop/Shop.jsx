import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Phone, Clock, Store as StoreIcon, Users, Globe, Building } from 'lucide-react';
import MyHeader from '../../components/Header/Header';
import MyFooter from '../../components/Footer/Footer';
import storeService from '../../apis/storeService';
import { Spin } from 'antd';

import locationService from '../../apis/locationService';

function Shop() {
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await locationService.getProvinces();
        setProvincesList(data || []);
        if (data.length > 0) {
          // Set default to Hà Nội if exists, otherwise first one
          const hanoi = data.find(p => p.name.includes('Hà Nội')) || data[0];
          setProvince(hanoi.name);
          setDistrictsList(hanoi.districts || []);
        }
      } catch (error) {
        console.error('Fetch provinces error:', error);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = (name) => {
    setProvince(name);
    setDistrict('');
    const selected = provincesList.find(p => p.name === name);
    setDistrictsList(selected ? (selected.districts || []) : []);
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {};
      if (province) params.city = province;
      if (district) params.district = district;
      if (searchTerm.trim()) params.search = searchTerm.trim();
      const res = await storeService.getStores(params);
      setStores(res || []);
    } catch (error) {
      console.error('Fetch stores error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStores();
    }, searchTerm ? 400 : 0);
    return () => clearTimeout(timer);
  }, [province, district, searchTerm]);

  return (
    <>
      <MyHeader />
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <h1 className={styles.title}>Hệ thống cửa hàng</h1>
          <p className={styles.subtitle}>Tìm kiếm cửa hàng gần bạn nhất để trải nghiệm thực phẩm tươi sạch mỗi ngày</p>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={`${styles.card} ${styles.orange}`}>
            <div className={styles.cardContent}>
              <p>Cửa hàng</p>
              <h2>{stores.length + 26}+</h2>
            </div>
            <Building className={styles.bgIcon} />
          </div>
          <div className={`${styles.card} ${styles.blue}`}>
            <div className={styles.cardContent}>
              <p>Tỉnh/Thành</p>
              <h2>2+</h2>
            </div>
            <Globe className={styles.bgIcon} />
          </div>
          <div className={`${styles.card} ${styles.green}`}>
            <div className={styles.cardContent}>
              <p>Đối tác</p>
              <h2>500+</h2>
            </div>
            <Users className={styles.bgIcon} />
          </div>
          <div className={`${styles.card} ${styles.purple}`}>
            <div className={styles.cardContent}>
              <p>Nhân sự</p>
              <h2>300+</h2>
            </div>
            <StoreIcon className={styles.bgIcon} />
          </div>
        </div>

        <div className={styles.main}>
          {/* LEFT: Filter */}
          <div className={styles.filterSection}>
            <div className={styles.filterCard}>
              <h3 className={styles.filterTitle}>
                <MapPin size={20} className="inline mr-2" />
                Bộ lọc tìm kiếm
              </h3>

              <div className={styles.field}>
                <label>Tìm kiếm cửa hàng</label>
                <input
                  type="text"
                  placeholder="Nhập tên cửa hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.field}>
                <label>Tỉnh/Thành phố</label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                >
                  <option value="" disabled>Chọn Tỉnh/Thành phố</option>
                  {provincesList.map((p) => (
                    <option key={p.code} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Quận/Huyện</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!province}
                >
                  <option value=''>Tất cả Quận/Huyện</option>
                  {districtsList.map((d) => (
                    <option key={d.code} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterFooter}>
                Tìm thấy <strong>{stores.length}</strong> cửa hàng phù hợp
              </div>
            </div>
          </div>

          {/* RIGHT: Store list */}
          <div className={styles.storeListWrapper}>
            {loading ? (
              <div className={styles.loadingArea}>
                <Spin size="large" tip="Đang tải danh sách cửa hàng..." />
              </div>
            ) : stores.length > 0 ? (
              <div className={styles.storeGrid}>
                {stores.map((store, index) => (
                  <div key={index} className={styles.storeCard}>
                    <div className={styles.storeHeader}>
                       <div className={styles.iconBox}>
                         <StoreIcon size={24} color="#0a7c2f" />
                       </div>
                       <h3>{store.name}</h3>
                    </div>
                    
                    <div className={styles.info}>
                      <p className={styles.address}>
                        <MapPin size={16} />
                        <span>{store.address}, {store.district}, {store.city}</span>
                      </p>
                      <p className={styles.phone}>
                        <Phone size={16} />
                        <span>{store.phone}</span>
                      </p>
                      <p className={styles.hours}>
                        <Clock size={16} />
                        <span>{store.opening_hours}</span>
                      </p>
                    </div>

                    <a
                      className={styles.btnMap}
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        store.name + ' ' + store.address
                      )}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Xem trên bản đồ <ChevronDown size={16} />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <StoreIcon size={48} color="#ccc" />
                <p>Không tìm thấy cửa hàng nào tại khu vực này.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
}

export default Shop;
