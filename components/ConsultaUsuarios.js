import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, Button, TextInput, RadioButton } from 'react-native-paper';

import { selectUsuarios, deletaUsuario } from '../database/database';

import {
  listarEntregasMongo,
  excluirEntregaMongo,
} from '../services/api';

export default function ConsultaUsuarios({ voltar, editar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [tipoBanco, setTipoBanco] = useState('sqlite');

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true);

      if (tipoBanco === 'sqlite') {
        const lista = await selectUsuarios();
        setUsuarios(lista || []);
      } else {
        const lista = await listarEntregasMongo();
        setUsuarios(lista || []);
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [tipoBanco]);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const confirmarExclusao = (item) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir esta entrega?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirUsuario(item),
        },
      ]
    );
  };

  const excluirUsuario = async (item) => {
    try {
      if (tipoBanco === 'sqlite') {
        await deletaUsuario(item.ID_US);
        Alert.alert('Sucesso', 'Entrega excluída do SQLite.');
      } else {
        await excluirEntregaMongo(item._id);
        Alert.alert('Sucesso', 'Entrega excluída do MongoDB.');
      }

      carregarUsuarios();
    } catch (error) {
      console.log('Erro ao excluir:', error);
      Alert.alert('Erro', 'Não foi possível excluir.');
    }
  };

  const getNome = (item) => {
    return tipoBanco === 'sqlite'
      ? item.NOME_US || ''
      : item.cliente || '';
  };

  const usuariosFiltrados = usuarios.filter((item) =>
    getNome(item).toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.cardPrincipal} mode="contained">
        <Card.Content>

          <View style={styles.header}>
            <Text style={styles.icone}>🔎</Text>

            <Text style={styles.titulo}>
              Consultar Entregas
            </Text>

            <Text style={styles.subtitulo}>
              Consulte, filtre, edite ou exclua entregas salvas no SQLite ou MongoDB.
            </Text>
          </View>

          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Fonte dos dados</Text>

              <RadioButton.Group
                onValueChange={(value) => {
                  setTipoBanco(value);
                  setBusca('');
                }}
                value={tipoBanco}
              >
                <View style={styles.radioContainer}>
                  <RadioButton.Item
                    label="SQLite"
                    value="sqlite"
                    mode="android"
                    style={styles.radioItem}
                  />

                  <RadioButton.Item
                    label="MongoDB"
                    value="mongo"
                    mode="android"
                    style={styles.radioItem}
                  />
                </View>
              </RadioButton.Group>

              <Text style={styles.infoBanco}>
                {tipoBanco === 'sqlite'
                  ? 'Modo local: consulta os dados salvos no dispositivo.'
                  : 'Modo online: consulta os dados da API com MongoDB.'}
              </Text>
            </Card.Content>
          </Card>

          <Button mode="outlined" onPress={voltar} style={styles.botaoVoltar}>
            Voltar
          </Button>

          <TextInput
            label="Buscar por cliente"
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
            <Card style={styles.cardEntrega}>
              <Card.Content>
                <Text style={styles.vazio}>Nenhum registro encontrado.</Text>
              </Card.Content>
            </Card>
          ) : (
            usuariosFiltrados.map((item, index) => (
              <Card
                key={
                  tipoBanco === 'sqlite'
                    ? `sqlite-${item.ID_US || index}`
                    : `mongo-${item._id || index}`
                }
                style={styles.cardEntrega}
              >
                <Card.Content>
                  {tipoBanco === 'sqlite' ? (
                    <>
                      <Text style={styles.nome}>📦 {item.NOME_US}</Text>
                      <Text style={styles.texto}>Produto: {item.PRODUTO_US || '-'}</Text>
                      <Text style={styles.status}>Status: {item.STATUS_US || 'Pendente'}</Text>
                      <Text style={styles.texto}>CEP: {item.CEP_US}</Text>
                      <Text style={styles.texto}>Logradouro: {item.LOGRADOURO_US}</Text>
                      <Text style={styles.texto}>Número: {item.NUMERO_US}</Text>
                      <Text style={styles.texto}>Complemento: {item.COMPLEMENTO_US || '-'}</Text>
                      <Text style={styles.texto}>Bairro: {item.BAIRRO_US}</Text>
                      <Text style={styles.texto}>Cidade: {item.CIDADE_US}</Text>
                      <Text style={styles.texto}>Estado: {item.ESTADO_US}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.nome}>📦 {item.cliente}</Text>
                      <Text style={styles.texto}>Produto: {item.produto || '-'}</Text>
                      <Text style={styles.status}>Status: {item.status || 'Pendente'}</Text>
                      <Text style={styles.texto}>CEP: {item.cep}</Text>
                      <Text style={styles.texto}>Logradouro: {item.logradouro}</Text>
                      <Text style={styles.texto}>Número: {item.numero}</Text>
                      <Text style={styles.texto}>Complemento: {item.complemento || '-'}</Text>
                      <Text style={styles.texto}>Bairro: {item.bairro}</Text>
                      <Text style={styles.texto}>Cidade: {item.cidade}</Text>
                      <Text style={styles.texto}>Estado: {item.estado}</Text>
                    </>
                  )}

                  <View style={styles.acoes}>
                    <Button
                      mode="contained-tonal"
                      onPress={() => editar(item)}
                      style={styles.botaoAcao}
                    >
                      Editar
                    </Button>

                    <Button
                      mode="contained"
                      onPress={() => confirmarExclusao(item)}
                      style={styles.botaoAcao}
                    >
                      Excluir
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}

        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#eef3f8',
    flexGrow: 1,
  },
  cardPrincipal: {
    borderRadius: 22,
    padding: 8,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  icone: {
    fontSize: 36,
    marginBottom: 6,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subtitulo: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },
  sectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#f7f9fb',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 4,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioItem: {
    flex: 1,
  },
  infoBanco: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  botaoVoltar: {
    marginBottom: 14,
    borderRadius: 12,
  },
  botaoAtualizar: {
    marginBottom: 16,
    borderRadius: 12,
  },
  input: {
    marginBottom: 12,
  },
  cardEntrega: {
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  nome: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  texto: {
    marginBottom: 2,
    color: '#444',
  },
  status: {
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#333',
  },
  vazio: {
    textAlign: 'center',
    color: '#666',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  botaoAcao: {
    flex: 1,
    borderRadius: 12,
  },
});