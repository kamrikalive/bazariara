
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
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

        const gardenProducts = allProducts.filter(product => product.category === 'Сад');

        const dbRef = ref(database, 'products/garden');

        await set(dbRef, gardenProducts);

        console.log("✅ Товары успешно загружены в /products/garden!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Ошибка при загрузке:", err);
        process.exit(1);
    }
}

uploadProducts();
