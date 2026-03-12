import React from 'react';
import { PaperProvider } from 'react-native-paper';
import ViaCep from './components/ViaCep';

export default function App() {
  return (
    <PaperProvider>
      <ViaCep />
    </PaperProvider>
  );
}