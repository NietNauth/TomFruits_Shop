import { dataWhyChoose } from './constants';
import WhyChooseInfo from './WhyChooseInfo';
import styles from './styles.module.scss';
function WhyChoose() {
  const { container, header, title, subtitle, list } = styles;

  return (
    <section id='why-choose'>
      <div className={container}>
        <div className={header}>
          <h2 className={title}>Tại sao chọn Tom Fruits?</h2>
          <p className={subtitle}>
            Chúng tôi tự hào vì sự an toàn và chất lượng của từng sản phẩm
          </p>
        </div>

        <div className={list}>
          {dataWhyChoose.map((item, index) => (
            <WhyChooseInfo
              key={index}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
