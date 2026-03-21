-- 已有库升级：为 users 增加展示昵称（可空，应用层 NULL/空串回退为 username）
-- 部署顺序：先执行本迁移，再部署依赖该列的应用版本。

USE mind_mirror;

ALTER TABLE users
  ADD COLUMN nickname VARCHAR(100) NULL
  AFTER password_hash;
