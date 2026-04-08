import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button, TextInput } from 'react-native-paper';
import { selectUsuarios, deletaUsuario } from '../database/database';

export default function ConsultaUsuarios({ voltar, editar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const lista = await selectUsuarios();
      setUsuarios(lista || []);
    } catch (error) {
      console.log('Erro ao carregar usuários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const confirmarExclusao = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => excluirUsuario(id) },
      ]
    );
  };

  const excluirUsuario = async (id) => {
    try {
      await deletaUsuario(id);
      Alert.alert('Sucesso', 'Usuário excluído com sucesso.');
      carregarUsuarios();
    } catch (error) {
      console.log('Erro ao excluir usuário:', error);
      Alert.alert('Erro', 'Não foi possível excluir o usuário.');
    }
  };

  // 🔥 FILTRO
  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.NOME_US.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.titulo}>
        Usuários Cadastrados
      </Text>

      <Button mode="outlined" onPress={voltar} style={styles.botaoVoltar}>
        Voltar
      </Button>

      {/* 🔍 CAMPO DE BUSCA */}
      <TextInput
        label="Buscar por nome"
        mode="outlined"
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
      />

      <Button
        mode="contained-tonal"
        onPress={carregarUsuarios}
        style={styles.botaoAtualizar}
        disabled={loading}
      >
        {loading ? 'Atualizando...' : 'Atualizar Lista'}
      </Button>

      {usuariosFiltrados.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text>Nenhum usuário encontrado.</Text>
          </Card.Content>
        </Card>
      ) : (
        usuariosFiltrados.map((usuario) => (
          <Card key={usuario.ID_US} style={styles.card}>
            <Card.Content>
              <Text style={styles.nome}>Nome: {usuario.NOME_US}</Text>
              <Text>CEP: {usuario.CEP_US}</Text>
              <Text>Logradouro: {usuario.LOGRADOURO_US}</Text>
              <Text>Número: {usuario.NUMERO_US}</Text>
              <Text>Complemento: {usuario.COMPLEMENTO_US || '-'}</Text>
              <Text>Bairro: {usuario.BAIRRO_US}</Text>
              <Text>Cidade: {usuario.CIDADE_US}</Text>
              <Text>Estado: {usuario.ESTADO_US}</Text>

              <View style={styles.acoes}>
                <Button
                  mode="contained-tonal"
                  onPress={() => editar(usuario)}
                  style={styles.botaoAcao}
                >
                  Editar
                </Button>

                <Button
                  mode="contained"
                  onPress={() => confirmarExclusao(usuario.ID_US)}
                  style={styles.botaoAcao}
                >
                  Excluir
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  botaoVoltar: {
    marginBottom: 12,
  },
  botaoAtualizar: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  card: {
    marginBottom: 14,
    borderRadius: 14,
  },
  nome: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  botaoAcao: {
    flex: 1,
  },
});