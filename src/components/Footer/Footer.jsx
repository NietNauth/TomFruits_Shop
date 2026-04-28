import styles from './styles.module.scss';
import { dataFooter } from './constans';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
function MyFooter() {
  const {
    footer,
    container,
    col,
    title,
    desc,
    list,
    item,
    contactItem,
    bottom,
  } = styles;

  return (
    <footer id='contact' className={footer}>
      <div className={container}>
        {/* Cột 1 */}
        <div className={col}>
          <h3 className={title}>🍃{dataFooter.about.title}</h3>
          <p className={desc}>{dataFooter.about.desc}</p>

          <div className={styles.social}>
            <div className={styles.icon}>
              <FaFacebookF />
            </div>
            <div className={styles.icon}>
              <FaInstagram />
            </div>
            <div className={styles.icon}>
              <FaYoutube />
            </div>
          </div>
        </div>

        {/* Cột 2 */}
        <div className={col}>
          <h3 className={title}>{dataFooter.support.title}</h3>
          <ul className={list}>
            {dataFooter.support.links.map((link, i) => (
              <li key={i} className={item}>
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3 */}
        <div className={col}>
          <h3 className={title}>{dataFooter.contact.title}</h3>
          <ul className={list}>
            {dataFooter.contact.info.map((itemData, i) => {
              let Icon;

              switch (itemData.type) {
                case 'address':
                  Icon = FiMapPin;
                  break;
                case 'phone':
                  Icon = FiPhone;
                  break;
                case 'email':
                  Icon = FiMail;
                  break;
                default:
                  Icon = FiMapPin;
              }

              return (
                <li key={i} className={contactItem}>
                  <span className={styles.iconSmall}>
                    <Icon />
                  </span>
                  {itemData.text}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={bottom}>
        © 2024 Thương mại điện tử hữu cơ. Tất cả quyền được bảo lưu. Vì sức khỏe
        cộng đồng.
      </div>
    </footer>
  );
}

export default MyFooter;
