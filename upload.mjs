
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';
import fs from 'fs';

const firebaseConfig = {
    databaseURL: "https://bazarge-95f65-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function uploadProducts() {
    try {
        const data = fs.readFileSync('products.json', 'utf8');
        const allProducts = JSON.parse(data);

        const hikingProducts = allProducts.filter(product => product.category === 'Товары для отдыха');

        const dbRef = ref(database, 'products/hiking');

        const snapshot = await get(dbRef);
        const existingProducts = snapshot.val() || [];

        const combinedProducts = [...existingProducts, ...hikingProducts];

        await set(dbRef, combinedProducts);

        console.log("✅ Товары успешно добавлены в /products/hiking!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Ошибка при загрузке:", err);
        process.exit(1);
    }
}

uploadProducts();
