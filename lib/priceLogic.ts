export const calculateDisplayPrice = (price: number): number => {
    if (price < 10) {
        return price * 2;
    }
    if (price >= 10 && price <= 40) {
        return price + 20;
    }
    if (price >= 41 && price <= 100) {
        return price + 30;
    }
    if (price >= 101 && price <= 200) {
        return price + 40;
    }
    if (price >= 201 && price <= 300) {
        return price + 50;
    }
    if (price >= 301 && price <= 500) {
        return price + 100;
    }
    // For prices 501 and above
    return price + 300;
};
