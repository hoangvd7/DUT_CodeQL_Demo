const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database(':memory:');

// 1. Security Smell: Hardcoded Credentials (Lưu tài khoản/mật khẩu quản trị trực tiếp trong code)
const ADMIN_TOKEN = "SECRET_SUPER_PASSWORD_ABC123";

app.get('/user-profile', (req, res) => {
    // Lấy dữ liệu user_id do người dùng truyền lên từ URL (ví dụ: /user-profile?id=1)
    let userId = req.query.id;

    // 2. Lỗ hổng bảo mật nghiêm trọng: SQL Injection (Cộng chuỗi trực tiếp vào câu lệnh SQL)
    // Kẻ tấn công có thể truyền vào id: "1 OR 1=1" để lấy toàn bộ dữ liệu của tất cả người dùng
    let query = "SELECT * FROM users WHERE id = " + userId;

    db.execute(query, (err, rows) => {
        if (err) {
            res.status(500).send("Lỗi hệ thống");
        } else {
            res.json(rows);
        }
    });
});

app.listen(3000, () => {
    console.log('Server đang chạy tại cổng 3000');
});