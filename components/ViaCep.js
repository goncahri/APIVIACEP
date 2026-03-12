import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Card,
  HelperText,
  Menu,
  Divider,
} from 'react-native-paper';

export default function ViaCep() {
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES',
    'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
    'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
  ];

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroCep, setErroCep] = useState('');

  // objeto com todos os campos editáveis
  const [dados, setDados] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  // função genérica para alterar qualquer campo
  const alterarCampo = (campo, valor) => {
    setDados((prev) => ({
      ...prev,
      [campo]: valor,
    }));
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
        setErroCep('CEP não encontrado.');
        return;
      }

      setDados((prev) => ({
        ...prev,
        cep: data.cep || prev.cep,
        logradouro: data.logradouro || '',
        numero: prev.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      }));
    } catch (error) {
      setErroCep('Erro ao buscar o CEP. Tente novamente.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cadastrar = () => {
    console.log('Dados cadastrados:', dados);
    alert('Cadastro realizado com sucesso!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="headlineSmall" style={styles.titulo}>
            Consulta ViaCEP
          </Text>

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
            mode="contained"
            onPress={buscarCep}
            style={styles.botaoBuscar}
          >
            Buscar CEP
          </Button>

          {loading && (
            <ActivityIndicator
              animating={true}
              size="large"
              style={styles.loading}
            />
          )}

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
                contentStyle={styles.menuButtonContent}
              >
                {dados.estado ? `Estado: ${dados.estado}` : 'Selecione o Estado'}
              </Button>
            }
          >
            {estados.map((uf, index) => (
              <View key={index}>
                <Menu.Item
                  onPress={() => {
                    alterarCampo('estado', uf);
                    setMenuVisible(false);
                  }}
                  title={uf}
                />
                <Divider />
              </View>
            ))}
          </Menu>

          <Button
            mode="contained"
            onPress={cadastrar}
            style={styles.botaoCadastrar}
          >
            Cadastrar
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 16,
    paddingVertical: 8,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  botaoBuscar: {
    marginBottom: 16,
    marginTop: 4,
  },
  botaoCadastrar: {
    marginTop: 20,
  },
  loading: {
    marginVertical: 16,
  },
  menuButtonContent: {
    justifyContent: 'flex-start',
    height: 50,
  },
});