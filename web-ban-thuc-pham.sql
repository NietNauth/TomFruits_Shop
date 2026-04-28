-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: web_ban_thuc_pham
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  KEY `idx_cart_user` (`user_id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (18,1,1,3);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `img` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Trái Cây Nhập Khẩu','2026-04-26 12:02:45','2026-04-26 12:02:45','https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',1),(2,'Trái Cây Nội Địa','2026-04-26 12:02:45','2026-04-26 12:02:45','https://images.unsplash.com/photo-1596040033229-a9821ebd05de?auto=format&fit=crop&q=80&w=800',1),(3,'Rau Củ Sạch','2026-04-26 12:02:45','2026-04-26 12:02:45','https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?auto=format&fit=crop&q=80&w=800',1),(4,'Thực Phẩm Khô','2026-04-26 12:02:45','2026-04-26 12:02:45','https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',1),(5,'Giỏ Quà Cao Cấp','2026-04-26 12:02:45','2026-04-26 12:02:45','https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&q=80&w=800',1);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` enum('percent','fixed') NOT NULL DEFAULT 'percent',
  `discount_value` decimal(15,2) NOT NULL,
  `min_order_value` decimal(15,2) DEFAULT 0.00,
  `max_discount` decimal(15,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL COMMENT 'NULL = khong gioi han',
  `used_count` int(11) DEFAULT 0,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'WELCOME50',NULL,'fixed',50000.00,200000.00,NULL,100,5,'2026-04-26 19:02:46','2026-07-26 19:02:46',1,NULL,'2026-04-26 12:02:46','2026-04-26 12:02:46'),(2,'FREESHIP',NULL,'fixed',30000.00,500000.00,NULL,500,0,'2026-04-26 19:02:46','2027-04-26 19:02:46',1,NULL,'2026-04-26 12:02:46','2026-04-26 12:02:46');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('admin','manager','staff') NOT NULL DEFAULT 'staff',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_employees_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Admin Tom Fruits','admin@gmail.com','$2y$12$YJuK27j0T/IjzN3Uc5iao.ZX7Da32B/Gzo0Fm3u.kjLdVXmqpbbB6','0123456789',NULL,'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200','admin',1,'2026-04-26 12:02:46','2026-04-28 09:17:46'),(2,'Trần Thị Nhân Viên','staff@gmail.com','$2y$12$CBZtkgO6PYLUgNoK57Iqz.cdvsvZ4nJpTlH/WltBx4/teQSxrLV7a','0912345678',NULL,'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200','staff',1,'2026-04-26 12:02:46','2026-04-26 12:02:46');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2026_04_20_154245_create_user_addresses_table',1),(2,'2026_04_20_160000_optimize_user_and_address_tables',2),(3,'2026_04_20_161404_add_profile_fields_to_users_table',3),(5,'2026_04_22_154403_add_order_code_to_orders_table',5),(6,'2026_04_22_162243_add_shipping_fee_to_orders_table',6),(7,'2026_04_22_170130_change_payment_method_type_in_orders_table',7),(8,'2026_04_28_162752_create_stores_table',8);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(15,2) NOT NULL,
  `product_name` varchar(200) DEFAULT NULL,
  `product_img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_prod` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,195000.00,'Táo Envy Mỹ Size 70-80','https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800'),(2,1,6,1,145000.00,'Xoài Cát Hòa Lộc (Loại 1)','https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800'),(3,2,2,1,850000.00,'Nho Mẫu Đơn Nhật Bản','https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=800'),(4,3,2,1,850000.00,'Nho Mẫu Đơn Nhật Bản','https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=800'),(5,4,7,1,65000.00,'Bưởi Da Xanh Bến Tre','https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800'),(6,5,7,1,65000.00,'Bưởi Da Xanh Bến Tre','https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800'),(7,6,6,1,145000.00,'Xoài Cát Hòa Lộc (Loại 1)','https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800'),(8,7,2,1,850000.00,'Nho Mẫu Đơn Nhật Bản','https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=800'),(9,8,1,1,195000.00,'Táo Envy Mỹ Size 70-80','https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800'),(10,8,6,1,145000.00,'Xoài Cát Hòa Lộc (Loại 1)','https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800'),(11,9,7,1,65000.00,'Bưởi Da Xanh Bến Tre','https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_code` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `total_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(15,2) DEFAULT 0.00,
  `shipping_fee` decimal(15,2) NOT NULL DEFAULT 0.00,
  `final_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','shipping','completed','cancelled') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT 'cod',
  `payment_status` enum('unpaid','paid','refunded') DEFAULT 'unpaid',
  `receiver_name` varchar(100) DEFAULT NULL,
  `receiver_phone` varchar(15) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_code_unique` (`order_code`),
  KEY `coupon_id` (`coupon_id`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_created` (`created_at`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'TF-UEKPXZB1',1,1,340000.00,50000.00,0.00,290000.00,'pending','cod','unpaid','Nguyễn Văn Khách','0988888888','123 Đường Lê Lợi, Quận 1, TP.HCM','Giao hàng giờ hành chính giúp mình.','2026-04-26 12:02:46','2026-04-26 12:02:46'),(2,'TF-IJ8NEFH4',1,NULL,850000.00,0.00,0.00,850000.00,'completed','vnpay','paid','Nguyễn Văn Khách','0988888888','456 Nguyễn Huệ, Quận 1, TP.HCM',NULL,'2026-04-26 12:02:46','2026-04-26 12:02:46'),(3,'TF-HFSKRCVQ',2,NULL,850000.00,0.00,0.00,850000.00,'completed','cod','unpaid','Đỗ Tiến thuận','0973743482','số 26, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Thành phố Hà Nội',NULL,'2026-04-26 12:15:16','2026-04-26 12:24:44'),(4,'TF-8RSBLHUG',2,NULL,65000.00,0.00,30000.00,95000.00,'pending','vnpay','paid','123','0987654321','233, Xã Tiến Thịnh, Huyện Mê Linh, Thành phố Hà Nội',NULL,'2026-04-28 00:03:28','2026-04-28 00:09:25'),(5,'TF-O4J0YCLQ',2,NULL,65000.00,0.00,30000.00,95000.00,'pending','vnpay','unpaid','123','0987654321','233, Xã Tiến Thịnh, Huyện Mê Linh, Thành phố Hà Nội',NULL,'2026-04-28 00:11:11','2026-04-28 00:11:11'),(6,'TF-AANT82GM',2,NULL,145000.00,0.00,30000.00,175000.00,'pending','vnpay','unpaid','123','0987654321','233, Xã Tiến Thịnh, Huyện Mê Linh, Thành phố Hà Nội',NULL,'2026-04-28 00:30:42','2026-04-28 00:30:42'),(7,'TF-EU73YUIR',2,NULL,850000.00,0.00,0.00,850000.00,'completed','vnpay','paid','123','0987654321','233, Xã Tiến Thịnh, Huyện Mê Linh, Thành phố Hà Nội',NULL,'2026-04-28 00:36:47','2026-04-28 08:24:38'),(8,'TF-RLIFHJFK',2,NULL,340000.00,0.00,30000.00,370000.00,'completed','cod','paid','123','0987654321','233, Xã Tiến Thịnh, Huyện Mê Linh, Thành phố Hà Nội',NULL,'2026-04-28 08:10:43','2026-04-28 08:24:17'),(9,'TF-INSRWOBK',2,NULL,65000.00,0.00,30000.00,95000.00,'pending','vnpay','paid','123','0987654321','233, Xã Tiến Thịnh, Huyện Mê Linh, Thành phố Hà Nội',NULL,'2026-04-28 08:30:12','2026-04-28 08:30:45');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `old_price` decimal(15,2) DEFAULT NULL COMMENT 'Gia cu',
  `discount` decimal(5,2) DEFAULT 0.00 COMMENT 'Phan tram giam gia',
  `tag` enum('sale','hot','new','') DEFAULT '',
  `img` varchar(255) DEFAULT NULL,
  `unit` varchar(30) DEFAULT 'cai' COMMENT 'kg, g, thung, chai...',
  `weight` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `status` enum('in_stock','out_of_stock') NOT NULL DEFAULT 'in_stock',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_featured` tinyint(1) DEFAULT 0,
  `nutritional_info` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_status` (`status`),
  KEY `idx_products_tag` (`tag`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Táo Envy Mỹ Size 70-80',195000.00,220000.00,11.00,'hot','https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800','kg','1',49,'Táo Envy Mỹ nổi tiếng với độ giòn cao, vị ngọt đậm đà và hương thơm đặc trưng. Vỏ táo có màu đỏ thẫm xen lẫn các sọc vàng nhỏ li ti.','in_stock','2026-04-26 12:02:45','2026-04-28 08:10:43',1,'Giàu Vitamin C, chất xơ và chất chống oxy hóa giúp tăng cường hệ miễn dịch.',NULL),(2,1,'Nho Mẫu Đơn Nhật Bản',850000.00,950000.00,10.00,'new','https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=800','chùm','0.5-0.7',18,'Nho mẫu đơn (Shine Muscat) có trái to, màu xanh mướt, vị ngọt thanh và hương thơm như hoa cỏ.','in_stock','2026-04-26 12:02:45','2026-04-28 00:36:47',1,'Chứa nhiều vitamin B6, C, K và các khoáng chất có lợi cho tim mạch.',NULL),(3,1,'Cam Vàng Úc Navel',85000.00,95000.00,10.00,'sale','https://images.unsplash.com/photo-1582910830449-76579fc2c6a0?auto=format&fit=crop&q=80&w=800','kg','1',100,'Cam Navel Úc không hạt, mọng nước, vị ngọt đậm và rất dễ bóc vỏ.','in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,'Nguồn cung cấp Vitamin C dồi dào, giúp đẹp da và tăng sức đề kháng.',NULL),(4,1,'Lê Hàn Quốc Premium',125000.00,150000.00,16.00,'hot','https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&q=80&w=800','kg','1',45,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(5,1,'Kiwi Vàng New Zealand',180000.00,210000.00,14.00,'new','https://images.unsplash.com/photo-1585059895312-708b21c9906b?auto=format&fit=crop&q=80&w=800','kg','1',30,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(6,2,'Xoài Cát Hòa Lộc (Loại 1)',145000.00,160000.00,9.00,'hot','https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800','kg','1',58,'Xoài cát Hòa Lộc nổi tiếng với thịt quả dày, ít xơ, vị ngọt lịm và hương thơm nồng nàn.','in_stock','2026-04-26 12:02:45','2026-04-28 08:10:43',1,NULL,NULL),(7,2,'Bưởi Da Xanh Bến Tre',65000.00,75000.00,13.00,'sale','https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&q=80&w=800','quả','1.2-1.5',77,'Bưởi da xanh vỏ mỏng, tép bưởi hồng, mọng nước, vị ngọt thanh không đắng.','in_stock','2026-04-26 12:02:45','2026-04-28 08:30:12',1,NULL,NULL),(8,2,'Vú Sữa Lò Rèn',55000.00,65000.00,15.00,'new','https://images.unsplash.com/photo-1621213032506-69666bc0f507?auto=format&fit=crop&q=80&w=800','kg','1',40,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(9,2,'Thanh Long Ruột Đỏ',45000.00,55000.00,18.00,'sale','https://images.unsplash.com/photo-1527325672343-6961aa313496?auto=format&fit=crop&q=80&w=800','kg','1',120,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(10,2,'Măng Cụt Lái Thiêu',95000.00,110000.00,13.00,'hot','https://images.unsplash.com/photo-1621532450242-70b79313271a?auto=format&fit=crop&q=80&w=800','kg','1',35,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(11,3,'Cải Bó Xôi Đà Lạt',35000.00,45000.00,22.00,'hot','https://images.unsplash.com/photo-1576045057995-568f588f829a?auto=format&fit=crop&q=80&w=800','túi','0.5',100,'Cải bó xôi sạch trồng theo tiêu chuẩn VietGAP tại Đà Lạt, tươi non mỗi ngày.','in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(12,3,'Cà Chua Socola Đà Lạt',55000.00,65000.00,15.00,'new','https://images.unsplash.com/photo-1518977676601-b53f02bad67b?auto=format&fit=crop&q=80&w=800','kg','1',80,'Cà chua Socola có vị ngọt đậm, chứa hàm lượng dinh dưỡng cao hơn cà chua thường.','in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(13,3,'Súp Lơ Xanh (Broccoli)',48000.00,58000.00,17.00,'sale','https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&q=80&w=800','cây','0.4-0.6',50,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(14,3,'Ớt Chuông Đà Lạt Mix',75000.00,90000.00,16.00,'hot','https://images.unsplash.com/photo-1563513330617-3fef099f3d19?auto=format&fit=crop&q=80&w=800','kg','1',40,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(15,3,'Măng Tây Xinh',120000.00,140000.00,14.00,'new','https://images.unsplash.com/photo-1515471209610-dae1c9a58145?auto=format&fit=crop&q=80&w=800','túi','0.3',25,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(16,4,'Hạnh Nhân Rang Bơ',185000.00,210000.00,12.00,'hot','https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=800','hũ','0.5',100,'Hạnh nhân nhập khẩu Mỹ rang bơ thơm giòn, giàu dưỡng chất.','in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(17,4,'Hạt Dẻ Cười Mỹ',220000.00,250000.00,12.00,'new','https://images.unsplash.com/photo-1522253018251-5b7410292723?auto=format&fit=crop&q=80&w=800','hũ','0.5',30,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(18,4,'Trái Cây Sấy Dẻo Mix',145000.00,165000.00,12.00,'sale','https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=800','hũ','0.4',50,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(19,4,'Nho Khô Sultanas',110000.00,130000.00,15.00,'hot','https://images.unsplash.com/photo-1620706857370-e1b976fd082e?auto=format&fit=crop&q=80&w=800','túi','0.5',60,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(20,4,'Hạt Điều Rang Muối',165000.00,185000.00,10.00,'new','https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=800','hũ','0.5',45,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(21,5,'Giỏ Quà Trái Cây Phú Quý',1200000.00,1350000.00,11.00,'hot','https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&q=80&w=800','giỏ','5-6',10,'Giỏ quà bao gồm Táo Envy, Nho Mẫu Đơn, Cam Úc và Lê Hàn Quốc. Thiết kế sang trọng cho dịp lễ tết.','in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',1,NULL,NULL),(22,5,'Giỏ Quà Sức Khỏe',850000.00,950000.00,10.00,'new','https://images.unsplash.com/photo-1520281600329-873528b74737?auto=format&fit=crop&q=80&w=800','giỏ','4',15,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',1,NULL,NULL),(23,5,'Hộp Quà Trái Cây Mix',450000.00,550000.00,18.00,'sale','https://images.unsplash.com/photo-1619561131105-095537eb0a75?auto=format&fit=crop&q=80&w=800','hộp','2.5',20,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(24,5,'Giỏ Quà Tịnh Tâm',650000.00,750000.00,13.00,'hot','https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800','giỏ','3.5',10,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',0,NULL,NULL),(25,5,'Giỏ Quà Tết Đoàn Viên',1500000.00,1800000.00,16.00,'new','https://images.unsplash.com/photo-1511208687438-2c5a5abb810c?auto=format&fit=crop&q=80&w=800','giỏ','7',5,NULL,'in_stock','2026-04-26 12:02:45','2026-04-26 12:02:45',1,NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_product_order` (`user_id`,`product_id`,`order_id`),
  KEY `order_id` (`order_id`),
  KEY `idx_reviews_product` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,4,1,1,5,'Thit bo tuoi ngon, giao hang nhanh',1,'2026-04-13 14:36:52'),(2,1,1,1,4,'Rau sach, tuoi ngon',1,'2026-04-13 14:36:52'),(3,6,2,2,4,'Chat luong tot, gia hop ly',1,'2026-04-13 14:36:52');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `opening_hours` varchar(255) NOT NULL DEFAULT '6h30 - 19h30',
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'Tôm Mart Ba Vì','65 Tây Đằng, Ba Vì','Thành phố Hà Nội','Quận Cầu Giấy','0984068583','6h30 - 19h30',NULL,1,'2026-04-28 09:51:15','2026-04-28 10:14:38'),(2,'Tôm Fruits Giảng Võ','7C11 ngõ 140 Giảng Võ','Thành phố Hà Nội','Quận Hoàn Kiếm','0386500397','6h30 - 21h00',NULL,1,'2026-04-28 09:51:15','2026-04-28 10:15:03'),(3,'Tôm Fruits Quận 1','123 Lê Lợi, Phường Bến Thành','Thành phố Hồ Chí Minh','Quận 1','0123456789','7h00 - 22h00',NULL,1,'2026-04-28 09:51:15','2026-04-28 10:15:22'),(4,'Tôm Fruits Quận 7','456 Nguyễn Văn Linh','Thành phố Hồ Chí Minh','Quận 7','0987654321','8h00 - 21h00',NULL,1,'2026-04-28 09:51:15','2026-04-28 10:15:35');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_addresses`
--

DROP TABLE IF EXISTS `user_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_addresses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `receiver_name` varchar(255) NOT NULL,
  `receiver_phone` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `ward` varchar(255) NOT NULL,
  `address_detail` varchar(255) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_addresses_user_id_foreign` (`user_id`),
  CONSTRAINT `user_addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_addresses`
--

LOCK TABLES `user_addresses` WRITE;
/*!40000 ALTER TABLE `user_addresses` DISABLE KEYS */;
INSERT INTO `user_addresses` VALUES (1,1,'Nguyen Van An','0912345678','Thành phố Hà Nội','Quận Cầu Giấy','Phường Dịch Vọng Hậu','123',1,'2026-04-20 08:56:46','2026-04-20 09:25:15'),(3,3,'Le Minh Tuan','0934567890','Chưa cập nhật','Chưa cập nhật','Chưa cập nhật','789 Nguyen Hue, Ha Noi',1,'2026-04-20 08:56:46','2026-04-20 08:56:46'),(4,5,'Test User','0988888888','Tỉnh Bắc Ninh','Thành phố Bắc Ninh','Phường Vũ Ninh','123 Ph',1,'2026-04-22 09:29:09','2026-04-22 09:29:09'),(5,6,'Verification User','0999888777','Thành phố Hà Nội','Quận Ba Đình','Phường Phúc Xá','123 Le Loi Street, District 1, Ho Chi Minh City',1,'2026-04-22 09:50:04','2026-04-22 09:55:46'),(6,2,'Đỗ Tiến thuận','0973743482','Thành phố Hà Nội','Quận Cầu Giấy','Phường Dịch Vọng Hậu','số 26',0,'2026-04-26 12:14:37','2026-04-26 12:15:03'),(7,2,'123','0987654321','Thành phố Hà Nội','Huyện Mê Linh','Xã Tiến Thịnh','233',1,'2026-04-26 12:15:03','2026-04-26 12:15:03');
/*!40000 ALTER TABLE `user_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nguyễn Văn Khách','customer@gmail.com','$2y$12$.pumZN1lgQnoolsHDaRNNexxD6oMrVK6I8JTAKsROuzpO3tV.S5yy','0988888888',NULL,NULL,'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',1,'2026-04-26 12:02:46','2026-04-26 12:02:46'),(2,'Đỗ Tiến Thuận','dotienthuandvh@gmail.com','$2y$12$cjY4FwV6KT4EtvNmIUB7iOIFcEE4qPROpAO/bKYkySbG5002TCAd2','0973743482',NULL,NULL,NULL,1,'2026-04-26 12:13:58','2026-04-26 12:13:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-28 17:45:46
