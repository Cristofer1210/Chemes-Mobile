export const createProductsTable = `
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT UNIQUE,
  descripcion TEXT,
  desc_adicional TEXT,
  rubro TEXT,
  sub_rubro TEXT,
  sucursal TEXT,
  saldo REAL,
  deposito TEXT,
  pendiente REAL,
  lista_1 REAL,
  lista_2 REAL,
  lista_3 REAL,
  lista_4 REAL,
  lista_6 REAL
);
`;

export const migrations = [createProductsTable];
