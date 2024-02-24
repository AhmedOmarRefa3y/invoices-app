import axios from "axios";

export const GetProducts = async () => {
    const res = await axios.get(
        "https://last-app-1nm1.vercel.app/api/dd55814a-7978-4caf-85af-1d4f60b73959/products"
    );

    const products = res.data.map((i: any) => {
        return {
            name: i.name,
            featured: i.isFeatured,
            category: i.category.name,
            image: i.images[0].url,
        };
    });
    // console.log(products);
    return products;
};
