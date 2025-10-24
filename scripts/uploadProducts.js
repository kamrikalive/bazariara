import fs from "fs";
import path from "path";
import admin from "firebase-admin";

// === 🔧 Настройки ===
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString("utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bazarge-95f65-default-rtdb.europe-west1.firebasedatabase.app",
  });
}

const db = admin.database();

// === 📦 Основная функция ===
async function uploadProducts() {
  try {
    const filePath = path.resolve("products.json"); // Файл с товарами
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const ref = db.ref("products/hiking");

    // Очистим раздел перед загрузкой (если нужно)
    await ref.remove();

    // Переопределяем category для всех товаров
    const updates = {};
    data.forEach((item) => {
      item.category = "Товары для отдыха"; // ← здесь задаём категорию
      const newKey = ref.push().key;
      updates[newKey] = item;
    });

    await ref.update(updates);

    console.log("✅ Товары успешно загружены в /products/hiking с категорией 'Товары для отдыха'!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Ошибка при загрузке:", err);
    process.exit(1);
  }
}

uploadProducts();
