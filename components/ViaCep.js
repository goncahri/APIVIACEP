import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Card,
  HelperText,
  Menu,
  RadioButton,
} from 'react-native-paper';

import { inserirUsuario, updateUsuario } from '../database/database';

import {
  cadastrarEntregaMongo,
  atualizarEntregaMongo,
} from '../services/api';

export default function ViaCep({ voltar, usuarioEditando, finalizarEdicao }) {
  const estados = [
    'AC','AL','AP','AM','BA','CE','DF','ES',
    'GO','MA','MT','MS','MG','PA','PB','PR',
    'PE','PI','RJ','RN','RS','RO','RR','SC',
    'SP','SE','TO'
  ];

  const statusEntrega = ['Pendente', 'Em rota', 'Entregue'];

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuStatusVisible, setMenuStatusVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroCep, setErroCep] = useState('');
  const [tipoBanco, setTipoBanco] = useState('sqlite');

  const [dados, setDados] = useState({
    nome: '',
    produto: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    status: 'Pendente',
  });

  useEffect(() => {
    if (usuarioEditando) {
      if (usuarioEditando.ID_US) {
        setTipoBanco('sqlite');

        setDados({
          nome: usuarioEditando.NOME_US || '',
          produto: usuarioEditando.PRODUTO_US || '',
          cep: usuarioEditando.CEP_US || '',
          logradouro: usuarioEditando.LOGRADOURO_US || '',
          numero: usuarioEditando.NUMERO_US || '',
          complemento: usuarioEditando.COMPLEMENTO_US || '',
          bairro: usuarioEditando.BAIRRO_US || '',
          cidade: usuarioEditando.CIDADE_US || '',
          estado: usuarioEditando.ESTADO_US || '',
          status: usuarioEditando.STATUS_US || 'Pendente',
        });
      } else {
        setTipoBanco('mongo');

        setDados({
          nome: usuarioEditando.cliente || '',
          produto: usuarioEditando.produto || '',
          cep: usuarioEditando.cep || '',
          logradouro: usuarioEditando.logradouro || '',
          numero: usuarioEditando.numero || '',
          complemento: usuarioEditando.complemento || '',
          bairro: usuarioEditando.bairro || '',
          cidade: usuarioEditando.cidade || '',
          estado: usuarioEditando.estado || '',
          status: usuarioEditando.status || 'Pendente',
        });
      }
    }
  }, [usuarioEditando]);

  const alterarCampo = (campo, valor) => {
    setDados((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const limparFormulario = () => {
    setDados({
      nome: '',
      produto: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      status: 'Pendente',
    });
  };

  const buscarCep = async () => {
    const cepLimpo = dados.cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      setErroCep('Digite um CEP válido com 8 números.');
      return;
    }

    try {
      setLoading(true);
      setErroCep('');

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErroCep('CEP inválido ou não encontrado.');
        return;
      }

      setDados((prev) => ({
        ...prev,
        cep: data.cep,
        logradouro: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      }));
    } catch (error) {
      console.log(error);
      setErroCep('Erro ao buscar CEP.');
    } finally {
      setLoading(false);
    }
  };

  const salvar = async () => {
    if (!dados.nome.trim()) {
      alert('Digite o nome do cliente.');
      return;
    }

    if (!dados.produto.trim()) {
      alert('Digite o produto da entrega.');
      return;
    }

    if (!dados.cep.trim()) {
      alert('Digite o CEP.');
      return;
    }

    if (!dados.numero.trim()) {
      alert('Digite o número.');
      return;
    }

    if (!dados.logradouro.trim() || !dados.bairro.trim() || !dados.cidade.trim() || !dados.estado.trim()) {
      alert('Busque o CEP ou preencha os dados do endereço.');
      return;
    }

    try {
      if (tipoBanco === 'sqlite') {
        if (usuarioEditando && usuarioEditando.ID_US) {
          await updateUsuario(
            usuarioEditando.ID_US,
            dados.nome,
            dados.produto,
            dados.cep,
            dados.logradouro,
            dados.numero,
            dados.complemento,
            dados.bairro,
            dados.cidade,
            dados.estado,
            dados.status
          );

          alert('Entrega atualizada no SQLite com sucesso!');
          finalizarEdicao && finalizarEdicao();
        } else {
          await inserirUsuario(
            dados.nome,
            dados.produto,
            dados.cep,
            dados.logradouro,
            dados.numero,
            dados.complemento,
            dados.bairro,
            dados.cidade,
            dados.estado,
            dados.status
          );

          alert('Entrega cadastrada no SQLite com sucesso!');
        }
      } else {
        const entrega = {
          cliente: dados.nome,
          produto: dados.produto,
          cep: dados.cep,
          logradouro: dados.logradouro,
          numero: dados.numero,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.estado,
          status: dados.status,
        };

        if (usuarioEditando && usuarioEditando._id) {
          await atualizarEntregaMongo(usuarioEditando._id, entrega);

          alert('Entrega atualizada no MongoDB com sucesso!');
          finalizarEdicao && finalizarEdicao();
        } else {
          await cadastrarEntregaMongo(entrega);

          alert('Entrega cadastrada no MongoDB com sucesso!');
        }
      }

      limparFormulario();
      setErroCep('');
    } catch (error) {
      console.log(error);
      alert('Erro ao salvar a entrega.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card} mode="contained">
        <Card.Content>

          <View style={styles.header}>
            <Text style={styles.icone}>📦</Text>

            <Text style={styles.titulo}>
              {usuarioEditando ? 'Editar Entrega' : 'Nova Entrega'}
            </Text>

            <Text style={styles.subtitulo}>
              Preencha os dados do cliente, busque o endereço pelo CEP e escolha onde salvar.
            </Text>
          </View>

          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Armazenamento</Text>

              <RadioButton.Group
                onValueChange={(value) => setTipoBanco(value)}
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
                  ? 'Modo local: os dados ficam salvos no dispositivo.'
                  : 'Modo online: os dados são enviados para a API com MongoDB.'}
              </Text>
            </Card.Content>
          </Card>

          <Button mode="outlined" onPress={voltar} style={styles.botaoVoltar}>
            Voltar
          </Button>

          <Text style={styles.sectionTitle}>Dados da entrega</Text>

          <TextInput
            label="Nome do Cliente"
            mode="outlined"
            value={dados.nome}
            onChangeText={(text) => alterarCampo('nome', text)}
            style={styles.input}
          />

          <TextInput
            label="Produto"
            mode="outlined"
            value={dados.produto}
            onChangeText={(text) => alterarCampo('produto', text)}
            style={styles.input}
          />

          <Menu
            visible={menuStatusVisible}
            onDismiss={() => setMenuStatusVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuStatusVisible(true)}
                style={styles.input}
              >
                Status: {dados.status}
              </Button>
            }
          >
            {statusEntrega.map((status) => (
              <Menu.Item
                key={status}
                title={status}
                onPress={() => {
                  alterarCampo('status', status);
                  setMenuStatusVisible(false);
                }}
              />
            ))}
          </Menu>

          <Text style={styles.sectionTitle}>Endereço</Text>

          <TextInput
            label="CEP"
            mode="outlined"
            value={dados.cep}
            onChangeText={(text) => alterarCampo('cep', text)}
            keyboardType="numeric"
            style={styles.input}
          />

          <HelperText type="error" visible={!!erroCep}>
            {erroCep}
          </HelperText>

          <Button
            mode="contained-tonal"
            onPress={buscarCep}
            style={styles.botaoBuscar}
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar CEP'}
          </Button>

          {loading && <ActivityIndicator style={styles.loading} />}

          <TextInput
            label="Logradouro"
            mode="outlined"
            value={dados.logradouro}
            onChangeText={(text) => alterarCampo('logradouro', text)}
            style={styles.input}
          />

          <TextInput
            label="Número"
            mode="outlined"
            value={dados.numero}
            onChangeText={(text) => alterarCampo('numero', text)}
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Complemento"
            mode="outlined"
            value={dados.complemento}
            onChangeText={(text) => alterarCampo('complemento', text)}
            style={styles.input}
          />

          <TextInput
            label="Bairro"
            mode="outlined"
            value={dados.bairro}
            onChangeText={(text) => alterarCampo('bairro', text)}
            style={styles.input}
          />

          <TextInput
            label="Cidade"
            mode="outlined"
            value={dados.cidade}
            onChangeText={(text) => alterarCampo('cidade', text)}
            style={styles.input}
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.input}
              >
                {dados.estado ? `Estado: ${dados.estado}` : 'Selecionar Estado'}
              </Button>
            }
          >
            {estados.map((uf) => (
              <Menu.Item
                key={uf}
                title={uf}
                onPress={() => {
                  alterarCampo('estado', uf);
                  setMenuVisible(false);
                }}
              />
            ))}
          </Menu>

          <Button
            mode="contained"
            onPress={salvar}
            style={styles.botaoCadastrar}
          >
            {usuarioEditando ? 'Atualizar Entrega' : 'Salvar Entrega'}
          </Button>

        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#eef3f8',
  },
  card: {
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
  input: {
    marginBottom: 10,
  },
  botaoBuscar: {
    marginBottom: 12,
    borderRadius: 12,
  },
  botaoCadastrar: {
    marginTop: 20,
    borderRadius: 12,
  },
  botaoVoltar: {
    marginBottom: 18,
    borderRadius: 12,
  },
  loading: {
    marginVertical: 10,
  },
});