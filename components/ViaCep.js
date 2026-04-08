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
} from 'react-native-paper';
import { inserirUsuario, updateUsuario } from '../database/database';

export default function ViaCep({ voltar, usuarioEditando, finalizarEdicao }) {

  const estados = [
    'AC','AL','AP','AM','BA','CE','DF','ES',
    'GO','MA','MT','MS','MG','PA','PB','PR',
    'PE','PI','RJ','RN','RS','RO','RR','SC',
    'SP','SE','TO'
  ];

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroCep, setErroCep] = useState('');

  const [dados, setDados] = useState({
    nome: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  // 🔥 PREENCHER CAMPOS AO EDITAR
  useEffect(() => {
    if (usuarioEditando) {
      setDados({
        nome: usuarioEditando.NOME_US,
        cep: usuarioEditando.CEP_US,
        logradouro: usuarioEditando.LOGRADOURO_US,
        numero: usuarioEditando.NUMERO_US,
        complemento: usuarioEditando.COMPLEMENTO_US,
        bairro: usuarioEditando.BAIRRO_US,
        cidade: usuarioEditando.CIDADE_US,
        estado: usuarioEditando.ESTADO_US,
      });
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
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    });
  };

  const buscarCep = async () => {
    const cepLimpo = dados.cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      setErroCep('Digite um CEP válido.');
      return;
    }

    try {
      setLoading(true);
      setErroCep('');

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErroCep('CEP inválido.');
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
      setErroCep('Erro ao buscar CEP');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FUNÇÃO FINAL (INSERT + UPDATE)
  const salvar = async () => {

    if (!dados.nome.trim()) {
      alert('Digite o nome');
      return;
    }

    try {

      if (usuarioEditando) {
        await updateUsuario(
          usuarioEditando.ID_US,
          dados.nome,
          dados.cep,
          dados.logradouro,
          dados.numero,
          dados.complemento,
          dados.bairro,
          dados.cidade,
          dados.estado
        );

        alert('Atualizado com sucesso!');
        finalizarEdicao();

      } else {
        await inserirUsuario(
          dados.nome,
          dados.cep,
          dados.logradouro,
          dados.numero,
          dados.complemento,
          dados.bairro,
          dados.cidade,
          dados.estado
        );

        alert('Cadastrado com sucesso!');
      }

      limparFormulario();

    } catch (error) {
      console.log(error);
      alert('Erro ao salvar');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>

          <Text style={styles.titulo}>
            {usuarioEditando ? 'Editar Usuário' : 'Cadastro de Usuário'}
          </Text>

          <Button mode="outlined" onPress={voltar} style={styles.botaoVoltar}>
            Voltar
          </Button>

          <TextInput
            label="Nome"
            mode="outlined"
            value={dados.nome}
            onChangeText={(text) => alterarCampo('nome', text)}
            style={styles.input}
          />

          <TextInput
            label="CEP"
            mode="outlined"
            value={dados.cep}
            onChangeText={(text) => alterarCampo('cep', text)}
            style={styles.input}
          />

          <HelperText type="error" visible={!!erroCep}>
            {erroCep}
          </HelperText>

          <Button mode="contained" onPress={buscarCep}>
            Buscar CEP
          </Button>

          {loading && <ActivityIndicator style={styles.loading} />}

          <TextInput label="Logradouro" mode="outlined"
            value={dados.logradouro}
            onChangeText={(t) => alterarCampo('logradouro', t)}
            style={styles.input}
          />

          <TextInput label="Número" mode="outlined"
            value={dados.numero}
            onChangeText={(t) => alterarCampo('numero', t)}
            style={styles.input}
          />

          <TextInput label="Complemento" mode="outlined"
            value={dados.complemento}
            onChangeText={(t) => alterarCampo('complemento', t)}
            style={styles.input}
          />

          <TextInput label="Bairro" mode="outlined"
            value={dados.bairro}
            onChangeText={(t) => alterarCampo('bairro', t)}
            style={styles.input}
          />

          <TextInput label="Cidade" mode="outlined"
            value={dados.cidade}
            onChangeText={(t) => alterarCampo('cidade', t)}
            style={styles.input}
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button onPress={() => setMenuVisible(true)}>
                {dados.estado || 'Selecionar Estado'}
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
            {usuarioEditando ? 'Atualizar' : 'Cadastrar'}
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
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 16,
    padding: 10,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 10,
  },
  botaoCadastrar: {
    marginTop: 20,
  },
  botaoVoltar: {
    marginBottom: 10,
  },
  loading: {
    marginVertical: 10,
  },
});