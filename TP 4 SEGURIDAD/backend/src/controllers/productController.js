const { db } = require('../config/database');

// CORREGIDO: SQL Injection - usando consultas parametrizadas
const getProducts = (req, res) => {
  const { category, search } = req.query;
  
  // Usar consultas parametrizadas para prevenir SQL injection
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }
  
  db.query(query, params, (err, results) => {
    if (err) {
      // No exponer detalles del error SQL
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
};

module.exports = {
  getProducts
};
