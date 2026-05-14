import * as SQLite from 'expo-sqlite';

let db = null;

export async function Banco() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('FatecV');
    console.log('Banco aberto/criado com sucesso!');
  }
  return db;
}

export async function createTable() {
  try {
    const database = await Banco();

    await database.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS USUARIO (
        ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
        NOME_US TEXT,
        PRODUTO_US TEXT,
        CEP_US TEXT,
        LOGRADOURO_US TEXT,
        NUMERO_US TEXT,
        COMPLEMENTO_US TEXT,
        BAIRRO_US TEXT,
        CIDADE_US TEXT,
        ESTADO_US TEXT,
        STATUS_US TEXT
      );
    `);

    await database.execAsync(`
      ALTER TABLE USUARIO ADD COLUMN PRODUTO_US TEXT;
    `).catch(() => {});

    await database.execAsync(`
      ALTER TABLE USUARIO ADD COLUMN STATUS_US TEXT;
    `).catch(() => {});

    console.log('Tabela USUARIO criada/atualizada com sucesso!');
  } catch (error) {
    console.log('Erro ao criar/atualizar tabela:', error);
  }
}

export async function inserirUsuario(
  nome,
  produto,
  cep,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  status
) {
  try {
    const database = await Banco();

    await database.runAsync(
      `INSERT INTO USUARIO
      (NOME_US, PRODUTO_US, CEP_US, LOGRADOURO_US, NUMERO_US, COMPLEMENTO_US, BAIRRO_US, CIDADE_US, ESTADO_US, STATUS_US)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      nome,
      produto,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      status
    );

    console.log('Entrega inserida com sucesso!');
  } catch (error) {
    console.log('Erro ao inserir entrega:', error);
  }
}

export async function selectUsuarios() {
  try {
    const database = await Banco();
    const resultado = await database.getAllAsync('SELECT * FROM USUARIO');
    console.log('Entregas encontradas!');
    return resultado;
  } catch (error) {
    console.log('Erro ao listar entregas:', error);
    return [];
  }
}

export async function selectUsuarioId(id) {
  try {
    const database = await Banco();
    const resultado = await database.getFirstAsync(
      'SELECT * FROM USUARIO WHERE ID_US = ?',
      id
    );
    console.log('Entrega encontrada!');
    return resultado;
  } catch (error) {
    console.log('Erro ao buscar entrega:', error);
    return null;
  }
}

export async function updateUsuario(
  id,
  nome,
  produto,
  cep,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  status
) {
  try {
    const database = await Banco();

    await database.runAsync(
      `UPDATE USUARIO SET
        NOME_US = ?,
        PRODUTO_US = ?,
        CEP_US = ?,
        LOGRADOURO_US = ?,
        NUMERO_US = ?,
        COMPLEMENTO_US = ?,
        BAIRRO_US = ?,
        CIDADE_US = ?,
        ESTADO_US = ?,
        STATUS_US = ?
      WHERE ID_US = ?`,
      nome,
      produto,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      status,
      id
    );

    console.log('Entrega atualizada com sucesso!');
  } catch (error) {
    console.log('Erro ao atualizar entrega:', error);
  }
}

export async function deletaUsuario(id) {
  try {
    const database = await Banco();
    await database.runAsync('DELETE FROM USUARIO WHERE ID_US = ?', id);
    console.log('Entrega deletada com sucesso!');
  } catch (error) {
    console.log('Erro ao deletar entrega:', error);
  }
}