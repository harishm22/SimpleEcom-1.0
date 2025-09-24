-- Create databases for SimpleEcom
CREATE DATABASE IF NOT EXISTS simpleecom_userdb;
CREATE DATABASE IF NOT EXISTS simpleecom_productdb;
CREATE DATABASE IF NOT EXISTS simpleecom_cartdb;

-- Create user and grant permissions
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON simpleecom_userdb.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON simpleecom_productdb.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON simpleecom_cartdb.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- Use product database and show it's ready
USE simpleecom_productdb;
SELECT 'Product database ready' as status;

-- Use cart database and show it's ready
USE simpleecom_cartdb;
SELECT 'Cart database ready' as status;

-- Use user database and show it's ready
USE simpleecom_userdb;
SELECT 'User database ready' as status;