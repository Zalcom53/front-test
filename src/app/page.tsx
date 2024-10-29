"use client"
import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=10&skip=${(currentPage - 1) * 10}`);
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      alert('Producto creado correctamente');
      setIsModalOpen(false);
      setNewProduct({ title: '', price: '', category: '', description: '' });
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al crear el producto');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Listado de Productos</h1>
      
      <button 
        onClick={() => setIsModalOpen(true)}
        style={{
          backgroundColor: '#4CAF50',
          border: 'none',
          color: 'white',
          padding: '10px 20px',
          textAlign: 'center',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '16px',
          margin: '4px 2px',
          cursor: 'pointer',
        }}
      >
        Agregar Nuevo Producto
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
            <h3>{product.title}</h3>
            <p>Precio: ${product.price}</p>
            <p>Categoría: {product.category}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: currentPage === page ? '#4CAF50' : '#f1f1f1',
              border: 'none',
              color: currentPage === page ? 'white' : 'black',
              cursor: 'pointer',
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            width: '300px',
          }}>
            <h2>Agregar Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="title">Nombre del producto:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProduct.title}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="price">Precio:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="category">Categoría:</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="description">Descripción:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '5px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    margin: '4px 2px',
                    cursor: 'pointer',
                  }}
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: '#f44336',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    margin: '4px 2px',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;