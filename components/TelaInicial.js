import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

export default function TelaInicial({ irParaCadastro, irParaConsulta }) {
  return (
    <View style={styles.container}>
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="headlineMedium" style={styles.titulo}>
            App de Cadastro
          </Text>

          <Text variant="bodyLarge" style={styles.subtitulo}>
            Escolha uma opção
          </Text>

          <Button
            mode="contained"
            onPress={irParaCadastro}
            style={styles.botao}
          >
            Cadastrar
          </Button>

          <Button
            mode="outlined"
            onPress={irParaConsulta}
            style={styles.botao}
          >
            Consultar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 20,
  },
  titulo: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  subtitulo: {
    textAlign: 'center',
    marginBottom: 24,
  },
  botao: {
    marginBottom: 14,
  },
});