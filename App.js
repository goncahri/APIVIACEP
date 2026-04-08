import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import ViaCep from './components/ViaCep';
import TelaInicial from './components/TelaInicial';
import ConsultaUsuarios from './components/ConsultaUsuarios';
import { createTable } from './database/database';

export default function App() {
  const [telaAtual, setTelaAtual] = useState('inicio');
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    createTable();
  }, []);

  return (
    <PaperProvider>

      {telaAtual === 'inicio' && (
        <TelaInicial
          irParaCadastro={() => {
            setUsuarioEditando(null);
            setTelaAtual('cadastro');
          }}
          irParaConsulta={() => setTelaAtual('consulta')}
        />
      )}

      {telaAtual === 'cadastro' && (
        <ViaCep
          voltar={() => setTelaAtual('inicio')}
          usuarioEditando={usuarioEditando}
          finalizarEdicao={() => setUsuarioEditando(null)}
        />
      )}

      {telaAtual === 'consulta' && (
        <ConsultaUsuarios
          voltar={() => setTelaAtual('inicio')}
          editar={(usuario) => {
            setUsuarioEditando(usuario);
            setTelaAtual('cadastro');
          }}
        />
      )}

    </PaperProvider>
  );
}