import { dataInfo } from './constans';
import InfoCard from './InfoCard/InfoCard';
import MainLayout from '../../../layouts/Layout/Layout';
import styles from './styles.module.scss';
function Info() {
  const { container } = styles;
  return (
    <MainLayout>
      <div className={container}>
        {dataInfo.map((item) => {
          return (
            <InfoCard
              key={item.title}
              content={item.title}
              description={item.description}
              src={item.src}
            />
          );
        })}
      </div>
    </MainLayout>
  );
}

export default Info;
