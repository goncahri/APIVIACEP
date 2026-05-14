import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button, Surface } from 'react-native-paper';

export default function TelaInicial({ irParaCadastro, irParaConsulta }) {
  return (
    <View style={styles.container}>
      <Surface style={styles.logoBox} elevation={3}>
        <Text style={styles.logo}>📦</Text>
      </Surface>

      <Text style={styles.nomeApp}>Entrego</Text>

      <Text style={styles.descricao}>
        Gestão simples de entregas com endereço automático via CEP.
      </Text>

      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="titleLarge" style={styles.titulo}>
            O que deseja fazer?
          </Text>

          <Button
            mode="contained"
            onPress={irParaCadastro}
            style={styles.botao}
            contentStyle={styles.botaoConteudo}
          >
            Nova Entrega
          </Button>

          <Button
            mode="outlined"
            onPress={irParaConsulta}
            style={styles.botao}
            contentStyle={styles.botaoConteudo}
          >
            Consultar Entregas
          </Button>

          <Text style={styles.rodape}>
            SQLite para modo local • MongoDB para modo online
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3f8',
    justifyContent: 'center',
    padding: 20,
  },
  logoBox: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    backgroundColor: '#ffffff',
  },
  logo: {
    fontSize: 42,
  },
  nomeApp: {
    textAlign: 'center',
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descricao: {
    textAlign: 'center',
    fontSize: 15,
    color: '#555',
    marginBottom: 28,
  },
  card: {
    borderRadius: 22,
    paddingVertical: 18,
    backgroundColor: '#ffffff',
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 22,
    fontWeight: 'bold',
  },
  botao: {
    marginBottom: 14,
    borderRadius: 12,
  },
  botaoConteudo: {
    height: 48,
  },
  rodape: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
});