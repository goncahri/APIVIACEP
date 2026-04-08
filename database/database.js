import * as SQLite from 'expo-sqlite';

let db = null;

// abrir banco
export async function Banco() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('FatecV');
    console.log('Banco aberto/criado com sucesso!');
  }
  return db;
}

// criar tabela
export async function createTable() {
  try {
    const database = await Banco();

    await database.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS USUARIO (
        ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
        NOME_US TEXT,
        CEP_US TEXT,
        LOGRADOURO_US TEXT,
        NUMERO_US TEXT,
        COMPLEMENTO_US TEXT,
        BAIRRO_US TEXT,
        CIDADE_US TEXT,
        ESTADO_US TEXT
      );
    `);

    console.log('Tabela USUARIO criada com sucesso!');
  } catch (error) {
    console.log('Erro ao criar tabela:', error);
  }
}

// inserir usuário
export async function inserirUsuario(
  nome,
  cep,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  estado
) {
  try {
    const database = await Banco();

    await database.runAsync(
      `INSERT INTO USUARIO
      (NOME_US, CEP_US, LOGRADOURO_US, NUMERO_US, COMPLEMENTO_US, BAIRRO_US, CIDADE_US, ESTADO_US)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      nome,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    );

    console.log('Usuário inserido com sucesso!');
  } catch (error) {
    console.log('Erro ao inserir usuário:', error);
  }
}

// listar usuários
export async function selectUsuarios() {
  try {
    const database = await Banco();
    const resultado = await database.getAllAsync('SELECT * FROM USUARIO');
    console.log('Usuários encontrados!');
    return resultado;
  } catch (error) {
    console.log('Erro ao listar usuários:', error);
    return [];
  }
}

// buscar usuário por id
export async function selectUsuarioId(id) {
  try {
    const database = await Banco();
    const resultado = await database.getFirstAsync(
      'SELECT * FROM USUARIO WHERE ID_US = ?',
      id
    );
    console.log('Usuário encontrado!');
    return resultado;
  } catch (error) {
    console.log('Erro ao buscar usuário:', error);
    return null;
  }
}

// atualizar usuário
export async function updateUsuario(
  id,
  nome,
  cep,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  estado
) {
  try {
    const database = await Banco();

    await database.runAsync(
      `UPDATE USUARIO SET
        NOME_US = ?,
        CEP_US = ?,
        LOGRADOURO_US = ?,
        NUMERO_US = ?,
        COMPLEMENTO_US = ?,
        BAIRRO_US = ?,
        CIDADE_US = ?,
        ESTADO_US = ?
      WHERE ID_US = ?`,
      nome,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      id
    );

    console.log('Usuário atualizado com sucesso!');
  } catch (error) {
    console.log('Erro ao atualizar usuário:', error);
  }
}

// deletar usuário
export async function deletaUsuario(id) {
  try {
    const database = await Banco();
    await database.runAsync('DELETE FROM USUARIO WHERE ID_US = ?', id);
    console.log('Usuário deletado com sucesso!');
  } catch (error) {
    console.log('Erro ao deletar usuário:', error);
  }
}