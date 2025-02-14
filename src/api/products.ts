export const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar produtos', error);
      return [];
    }
};