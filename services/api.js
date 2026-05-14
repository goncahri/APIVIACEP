const API_URL = 'http://172.20.10.13:3000';


// CADASTRAR
export async function cadastrarEntregaMongo(entrega) {
  const response = await fetch(`${API_URL}/entregas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entrega),
  });

  return await response.json();
}


// LISTAR
export async function listarEntregasMongo() {
  const response = await fetch(`${API_URL}/entregas`);

  return await response.json();
}


// ATUALIZAR
export async function atualizarEntregaMongo(id, entrega) {
  const response = await fetch(`${API_URL}/entregas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entrega),
  });

  return await response.json();
}


// EXCLUIR
export async function excluirEntregaMongo(id) {
  const response = await fetch(`${API_URL}/entregas/${id}`, {
    method: 'DELETE',
  });

  return await response.json();
}