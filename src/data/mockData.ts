// DADOS CENTRALIZADOS - REGIÃO DO PARANÁ
// Todas as páginas usam os mesmos dados

export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number;
  longitude: number;
  responsavel: string;
  bombonas_count: number;
  is_active: boolean;
}

export interface Bombona {
  id: number;
  identificacao: string;
  empresa_id: number;
  empresa: string;
  tipo_residuo: string;
  capacidade: number;
  peso_atual: number;
  percentual_ocupacao: number;
  status: 'normal' | 'quase_cheia' | 'cheia' | 'manutencao';
  localizacao: string;
  endereco: string;
  cidade: string;
  latitude: number;
  longitude: number;
  ultima_coleta: string;
  proxima_coleta: string;
  temperatura: number;
}

export interface Alerta {
  id: number;
  bombona_id: number;
  bombona_identificacao?: string;
  empresa_id?: number;
  empresa?: string;
  tipo: 'nivel_alto' | 'nivel_critico' | 'temperatura_alta' | 'contaminacao' | 'vazamento' | 'manutencao' | 'sensor_falha' | 'capacidade' | 'coleta_atrasada';
  nivel: 'baixo' | 'medio' | 'alto' | 'critico';
  descricao: string;
  data_alerta: string;
  status?: 'nao_resolvido' | 'resolvido';
  resolvido?: boolean;
  resolucao?: string | null;
  data_resolucao?: string;
  observacoes_resolucao?: string;
  tipo_residuo?: string;
}

export interface Coleta {
  id: number;
  bombona_id: number;
  bombona_identificacao: string;
  empresa_id: number;
  empresa: string;
  operador: string;
  data_coleta: string;
  peso_coletado: number;
  destino: string;
  empresa_destino: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  observacoes: string;
  numero_manifesto: string;
  tipo_residuo: string;
}

// EMPRESAS DA REGIÃO DO PARANÁ
export const EMPRESAS: Empresa[] = [
  {
    id: 1,
    nome: 'Hospital e Maternidade São Francisco - Cianorte',
    cnpj: '75.123.456/0001-10',
    email: 'residuos@hospitalsaofrancisco.com.br',
    telefone: '(44) 3619-2000',
    endereco: 'Av. Souza Naves, 1234',
    cidade: 'Cianorte',
    estado: 'PR',
    cep: '87200-000',
    latitude: -23.6636,
    longitude: -52.6056,
    responsavel: 'Dr. Carlos Eduardo Silva',
    bombonas_count: 2,
    is_active: true,
  },
  {
    id: 2,
    nome: 'Hospital Universitário Regional de Maringá - UEM',
    cnpj: '75.234.567/0001-11',
    email: 'meio.ambiente@huem.uem.br',
    telefone: '(44) 3011-9000',
    endereco: 'Av. Mandacaru, 1590',
    cidade: 'Maringá',
    estado: 'PR',
    cep: '87083-240',
    latitude: -23.4205,
    longitude: -51.9331,
    responsavel: 'Dra. Maria Helena Costa',
    bombonas_count: 2,
    is_active: true,
  },
  {
    id: 3,
    nome: 'Santa Casa de Maringá',
    cnpj: '75.345.678/0001-12',
    email: 'sustentabilidade@santacasamaringa.com.br',
    telefone: '(44) 3027-3434',
    endereco: 'Rua XV de Novembro, 1423',
    cidade: 'Maringá',
    estado: 'PR',
    cep: '87013-230',
    latitude: -23.4252,
    longitude: -51.9392,
    responsavel: 'Dr. João Pedro Almeida',
    bombonas_count: 2,
    is_active: true,
  },
  {
    id: 4,
    nome: 'Hospital São Paulo - Umuarama',
    cnpj: '75.456.789/0001-13',
    email: 'residuos@hospitalsaopaulo-uma.com.br',
    telefone: '(44) 3621-3000',
    endereco: 'Av. Rio Branco, 3355',
    cidade: 'Umuarama',
    estado: 'PR',
    cep: '87501-130',
    latitude: -23.7665,
    longitude: -53.3250,
    responsavel: 'Dra. Ana Paula Fernandes',
    bombonas_count: 1,
    is_active: true,
  },
  {
    id: 5,
    nome: 'Hospital e Maternidade Paraná - Paranavaí',
    cnpj: '75.567.890/0001-14',
    email: 'gestao.residuos@hospitalparana.com.br',
    telefone: '(44) 3423-1500',
    endereco: 'Rua Getúlio Vargas, 777',
    cidade: 'Paranavaí',
    estado: 'PR',
    cep: '87705-020',
    latitude: -23.0732,
    longitude: -52.4652,
    responsavel: 'Dr. Roberto Lima Santos',
    bombonas_count: 1,
    is_active: true,
  },
  {
    id: 6,
    nome: 'Clínica e Hospital São Vicente - Campo Mourão',
    cnpj: '75.678.901/0001-15',
    email: 'meio.ambiente@saovicente-cm.com.br',
    telefone: '(44) 3518-2000',
    endereco: 'Av. Capitão Índio Bandeira, 1050',
    cidade: 'Campo Mourão',
    estado: 'PR',
    cep: '87301-020',
    latitude: -24.0462,
    longitude: -52.3786,
    responsavel: 'Dra. Juliana Martins',
    bombonas_count: 1,
    is_active: true,
  },
  {
    id: 7,
    nome: 'Hospital Regional do Noroeste - Paranavai',
    cnpj: '75.789.012/0001-16',
    email: 'residuos@hospitalregional.pr.gov.br',
    telefone: '(44) 3045-3000',
    endereco: 'Rua Piauí, 550',
    cidade: 'Paranavaí',
    estado: 'PR',
    cep: '87703-030',
    latitude: -23.0777,
    longitude: -52.4585,
    responsavel: 'Dr. Fernando Oliveira',
    bombonas_count: 1,
    is_active: true,
  },
  {
    id: 8,
    nome: 'Hospital Santa Rita - Maringá',
    cnpj: '75.890.123/0001-17',
    email: 'sustentabilidade@santarita.com.br',
    telefone: '(44) 3031-7000',
    endereco: 'Av. Colombo, 2222',
    cidade: 'Maringá',
    estado: 'PR',
    cep: '87020-030',
    latitude: -23.4095,
    longitude: -51.9552,
    responsavel: 'Dra. Patricia Souza',
    bombonas_count: 2,
    is_active: true,
  },
];

// BOMBONAS - DISTRIBUÍDAS PELA REGIÃO
export const BOMBONAS: Bombona[] = [
  // Cianorte - Hospital São Francisco
  {
    id: 1,
    identificacao: 'CNT-HOS-001',
    empresa_id: 1,
    empresa: 'Hospital e Maternidade São Francisco - Cianorte',
    tipo_residuo: 'hospitalar_infectante',
    capacidade: 200,
    peso_atual: 164,
    percentual_ocupacao: 82,
    status: 'quase_cheia',
    localizacao: 'UTI - Ala A',
    endereco: 'Av. Souza Naves, 1234',
    cidade: 'Cianorte',
    latitude: -23.6636,
    longitude: -52.6056,
    ultima_coleta: '2024-11-25',
    proxima_coleta: '2024-12-02',
    temperatura: 23.5,
  },
  {
    id: 2,
    identificacao: 'CNT-HOS-002',
    empresa_id: 1,
    empresa: 'Hospital e Maternidade São Francisco - Cianorte',
    tipo_residuo: 'hospitalar_perfurocortante',
    capacidade: 200,
    peso_atual: 72,
    percentual_ocupacao: 36,
    status: 'normal',
    localizacao: 'Centro Cirúrgico',
    endereco: 'Av. Souza Naves, 1234',
    cidade: 'Cianorte',
    latitude: -23.6640,
    longitude: -52.6050,
    ultima_coleta: '2024-11-28',
    proxima_coleta: '2024-12-05',
    temperatura: 22.8,
  },
  // Maringá - Hospital Universitário
  {
    id: 3,
    identificacao: 'MGA-UEM-001',
    empresa_id: 2,
    empresa: 'Hospital Universitário Regional de Maringá - UEM',
    tipo_residuo: 'hospitalar_infectante',
    capacidade: 200,
    peso_atual: 190,
    percentual_ocupacao: 95,
    status: 'cheia',
    localizacao: 'Pronto Socorro',
    endereco: 'Av. Mandacaru, 1590',
    cidade: 'Maringá',
    latitude: -23.4205,
    longitude: -51.9331,
    ultima_coleta: '2024-11-20',
    proxima_coleta: '2024-12-01',
    temperatura: 24.2,
  },
  {
    id: 4,
    identificacao: 'MGA-UEM-002',
    empresa_id: 2,
    empresa: 'Hospital Universitário Regional de Maringá - UEM',
    tipo_residuo: 'hospitalar_quimico',
    capacidade: 200,
    peso_atual: 112,
    percentual_ocupacao: 56,
    status: 'normal',
    localizacao: 'Laboratório de Análises',
    endereco: 'Av. Mandacaru, 1590',
    cidade: 'Maringá',
    latitude: -23.4210,
    longitude: -51.9325,
    ultima_coleta: '2024-11-26',
    proxima_coleta: '2024-12-03',
    temperatura: 21.9,
  },
  // Maringá - Santa Casa
  {
    id: 5,
    identificacao: 'MGA-STC-001',
    empresa_id: 3,
    empresa: 'Santa Casa de Maringá',
    tipo_residuo: 'hospitalar_infectante',
    capacidade: 200,
    peso_atual: 146,
    percentual_ocupacao: 73,
    status: 'quase_cheia',
    localizacao: 'Enfermaria 2º Andar',
    endereco: 'Rua XV de Novembro, 1423',
    cidade: 'Maringá',
    latitude: -23.4252,
    longitude: -51.9392,
    ultima_coleta: '2024-11-24',
    proxima_coleta: '2024-12-01',
    temperatura: 23.1,
  },
  {
    id: 6,
    identificacao: 'MGA-STC-002',
    empresa_id: 3,
    empresa: 'Santa Casa de Maringá',
    tipo_residuo: 'farmaceutico',
    capacidade: 200,
    peso_atual: 74,
    percentual_ocupacao: 37,
    status: 'normal',
    localizacao: 'Farmácia Hospitalar',
    endereco: 'Rua XV de Novembro, 1423',
    cidade: 'Maringá',
    latitude: -23.4255,
    longitude: -51.9395,
    ultima_coleta: '2024-11-27',
    proxima_coleta: '2024-12-04',
    temperatura: 22.5,
  },
  // Umuarama
  {
    id: 7,
    identificacao: 'UMU-HSP-001',
    empresa_id: 4,
    empresa: 'Hospital São Paulo - Umuarama',
    tipo_residuo: 'hospitalar_infectante',
    capacidade: 200,
    peso_atual: 184,
    percentual_ocupacao: 92,
    status: 'cheia',
    localizacao: 'Isolamento',
    endereco: 'Av. Rio Branco, 3355',
    cidade: 'Umuarama',
    latitude: -23.7665,
    longitude: -53.3250,
    ultima_coleta: '2024-11-22',
    proxima_coleta: '2024-11-30',
    temperatura: 24.8,
  },
  // Paranavaí - Hospital Paraná
  {
    id: 8,
    identificacao: 'PNV-HPR-001',
    empresa_id: 5,
    empresa: 'Hospital e Maternidade Paraná - Paranavaí',
    tipo_residuo: 'hospitalar_perfurocortante',
    capacidade: 200,
    peso_atual: 48,
    percentual_ocupacao: 24,
    status: 'normal',
    localizacao: 'Sala de Vacinas',
    endereco: 'Rua Getúlio Vargas, 777',
    cidade: 'Paranavaí',
    latitude: -23.0732,
    longitude: -52.4652,
    ultima_coleta: '2024-11-29',
    proxima_coleta: '2024-12-06',
    temperatura: 22.3,
  },
  // Campo Mourão
  {
    id: 9,
    identificacao: 'CMO-SVC-001',
    empresa_id: 6,
    empresa: 'Clínica e Hospital São Vicente - Campo Mourão',
    tipo_residuo: 'hospitalar_quimico',
    capacidade: 200,
    peso_atual: 166,
    percentual_ocupacao: 83,
    status: 'quase_cheia',
    localizacao: 'Laboratório',
    endereco: 'Av. Capitão Índio Bandeira, 1050',
    cidade: 'Campo Mourão',
    latitude: -24.0462,
    longitude: -52.3786,
    ultima_coleta: '2024-11-23',
    proxima_coleta: '2024-12-01',
    temperatura: 23.7,
  },
  // Paranavaí - Hospital Regional
  {
    id: 10,
    identificacao: 'PNV-HRN-001',
    empresa_id: 7,
    empresa: 'Hospital Regional do Noroeste - Paranavai',
    tipo_residuo: 'hospitalar_infectante',
    capacidade: 200,
    peso_atual: 120,
    percentual_ocupacao: 60,
    status: 'normal',
    localizacao: 'Emergência',
    endereco: 'Rua Piauí, 550',
    cidade: 'Paranavaí',
    latitude: -23.0777,
    longitude: -52.4585,
    ultima_coleta: '2024-11-26',
    proxima_coleta: '2024-12-03',
    temperatura: 23.9,
  },
  // Maringá - Hospital Santa Rita
  {
    id: 11,
    identificacao: 'MGA-HSR-001',
    empresa_id: 8,
    empresa: 'Hospital Santa Rita - Maringá',
    tipo_residuo: 'solventes_organicos',
    capacidade: 200,
    peso_atual: 38,
    percentual_ocupacao: 19,
    status: 'normal',
    localizacao: 'Laboratório de Patologia',
    endereco: 'Av. Colombo, 2222',
    cidade: 'Maringá',
    latitude: -23.4095,
    longitude: -51.9552,
    ultima_coleta: '2024-11-30',
    proxima_coleta: '2024-12-07',
    temperatura: 21.8,
  },
  {
    id: 12,
    identificacao: 'MGA-HSR-002',
    empresa_id: 8,
    empresa: 'Hospital Santa Rita - Maringá',
    tipo_residuo: 'hospitalar_infectante',
    capacidade: 200,
    peso_atual: 14,
    percentual_ocupacao: 7,
    status: 'manutencao',
    localizacao: 'Centro Cirúrgico - Em manutenção',
    endereco: 'Av. Colombo, 2222',
    cidade: 'Maringá',
    latitude: -23.4100,
    longitude: -51.9545,
    ultima_coleta: '2024-11-15',
    proxima_coleta: '2024-12-10',
    temperatura: 22.0,
  },
];

// ALERTAS CORRESPONDENTES
export const ALERTAS: Alerta[] = [
  {
    id: 1,
    bombona_id: 3,
    bombona_identificacao: 'MGA-UEM-001',
    empresa_id: 2,
    empresa: 'Hospital Universitário Regional de Maringá - UEM',
    tipo: 'nivel_critico',
    nivel: 'critico',
    descricao: 'Bombona de resíduos infectantes atingiu 95% da capacidade - necessita coleta URGENTE',
    data_alerta: '2024-11-30T08:30:00Z',
    resolvido: false,
    tipo_residuo: 'hospitalar_infectante',
  },
  {
    id: 2,
    bombona_id: 7,
    bombona_identificacao: 'UMU-HSP-001',
    empresa_id: 4,
    empresa: 'Hospital São Paulo - Umuarama',
    tipo: 'nivel_critico',
    nivel: 'critico',
    descricao: 'Bombona lotada no setor de isolamento - risco de contaminação',
    data_alerta: '2024-11-30T10:15:00Z',
    resolvido: false,
    tipo_residuo: 'hospitalar_infectante',
  },
  {
    id: 3,
    bombona_id: 1,
    bombona_identificacao: 'CNT-HOS-001',
    empresa_id: 1,
    empresa: 'Hospital e Maternidade São Francisco - Cianorte',
    tipo: 'nivel_alto',
    nivel: 'alto',
    descricao: 'Bombona da UTI atingiu 82% da capacidade',
    data_alerta: '2024-11-30T14:20:00Z',
    resolvido: false,
    tipo_residuo: 'hospitalar_infectante',
  },
  {
    id: 4,
    bombona_id: 12,
    bombona_identificacao: 'MGA-HSR-002',
    empresa_id: 8,
    empresa: 'Hospital Santa Rita - Maringá',
    tipo: 'manutencao',
    nivel: 'medio',
    descricao: 'Bombona em manutenção preventiva - sensor de peso necessita calibração',
    data_alerta: '2024-11-28T09:00:00Z',
    resolvido: false,
    tipo_residuo: 'hospitalar_infectante',
  },
  {
    id: 5,
    bombona_id: 5,
    bombona_identificacao: 'MGA-STC-001',
    empresa_id: 3,
    empresa: 'Santa Casa de Maringá',
    tipo: 'nivel_alto',
    nivel: 'medio',
    descricao: 'Bombona atingiu 73% da capacidade - programar coleta',
    data_alerta: '2024-11-29T11:30:00Z',
    resolvido: true,
    data_resolucao: '2024-11-29T15:45:00Z',
    observacoes_resolucao: 'Coleta programada para 01/12',
    tipo_residuo: 'hospitalar_infectante',
  },
  {
    id: 6,
    bombona_id: 9,
    bombona_identificacao: 'CMO-SVC-001',
    empresa_id: 6,
    empresa: 'Clínica e Hospital São Vicente - Campo Mourão',
    tipo: 'temperatura_alta',
    nivel: 'alto',
    descricao: 'Temperatura da bombona química acima do limite (26°C)',
    data_alerta: '2024-11-30T16:00:00Z',
    resolvido: false,
    tipo_residuo: 'hospitalar_quimico',
  },
];

// COLETAS CORRESPONDENTES
export const COLETAS: Coleta[] = [
  {
    id: 1,
    bombona_id: 3,
    bombona_identificacao: 'MGA-UEM-001',
    empresa_id: 2,
    empresa: 'Hospital Universitário Regional de Maringá - UEM',
    operador: 'Carlos Mendes',
    data_coleta: '2024-12-01T09:00:00Z',
    peso_coletado: 142,
    destino: 'Incineração Hospitalar',
    empresa_destino: 'Stericycle Brasil - Maringá',
    status: 'pendente',
    observacoes: 'Coleta urgente - bombona crítica',
    numero_manifesto: 'MTR-2024-0001',
    tipo_residuo: 'hospitalar_infectante',
  },
  {
    id: 2,
    bombona_id: 7,
    bombona_identificacao: 'UMU-HSP-001',
    empresa_id: 4,
    empresa: 'Hospital São Paulo - Umuarama',
    operador: 'Roberto Lima',
    data_coleta: '2024-11-30T14:00:00Z',
    peso_coletado: 92,
    destino: 'Incineração Hospitalar',
    empresa_destino: 'Essencis Soluções Ambientais',
    status: 'em_andamento',
    observacoes: 'Material do setor de isolamento',
    numero_manifesto: 'MTR-2024-0002',
    tipo_residuo: 'hospitalar_infectante',
  },
  {
    id: 3,
    bombona_id: 5,
    bombona_identificacao: 'MGA-STC-001',
    empresa_id: 3,
    empresa: 'Santa Casa de Maringá',
    operador: 'Ana Paula Santos',
    data_coleta: '2024-11-29T10:30:00Z',
    peso_coletado: 88,
    destino: 'Incineração Hospitalar',
    empresa_destino: 'Stericycle Brasil - Maringá',
    status: 'concluida',
    observacoes: 'Coleta realizada conforme programação',
    numero_manifesto: 'MTR-2024-0003',
    tipo_residuo: 'hospitalar_infectante',
  },
  {
    id: 4,
    bombona_id: 1,
    bombona_identificacao: 'CNT-HOS-001',
    empresa_id: 1,
    empresa: 'Hospital e Maternidade São Francisco - Cianorte',
    operador: 'João Felipe Costa',
    data_coleta: '2024-11-25T11:00:00Z',
    peso_coletado: 115,
    destino: 'Incineração Hospitalar',
    empresa_destino: 'Veolia Serviços Ambientais',
    status: 'concluida',
    observacoes: 'Material da UTI - procedimento padrão',
    numero_manifesto: 'MTR-2024-0004',
    tipo_residuo: 'hospitalar_infectante',
  },
  {
    id: 5,
    bombona_id: 9,
    bombona_identificacao: 'CMO-SVC-001',
    empresa_id: 6,
    empresa: 'Clínica e Hospital São Vicente - Campo Mourão',
    operador: 'Patricia Souza',
    data_coleta: '2024-12-01T15:00:00Z',
    peso_coletado: 58,
    destino: 'Tratamento Químico',
    empresa_destino: 'Silcon Ambiental',
    status: 'pendente',
    observacoes: 'Resíduos químicos do laboratório',
    numero_manifesto: 'MTR-2024-0005',
    tipo_residuo: 'hospitalar_quimico',
  },
];

// FUNÇÃO PARA OBTER TIPO DE RESÍDUO FORMATADO
export const getTipoResiduoText = (tipo: string): string => {
  const tipos: { [key: string]: string } = {
    'hospitalar_infectante': 'Hospitalar Infectante',
    'hospitalar_quimico': 'Hospitalar Químico',
    'hospitalar_perfurocortante': 'Perfurocortante',
    'industrial_toxico': 'Industrial Tóxico',
    'solventes_organicos': 'Solventes Orgânicos',
    'metais_pesados': 'Metais Pesados',
    'farmaceutico': 'Farmacêutico',
    'outros_perigosos': 'Outros Perigosos'
  };
  return tipos[tipo] || tipo;
};

// COORDENADAS DA REGIÃO DO PARANÁ
export const REGIAO_PARANA = {
  center: {
    lat: -23.6636,  // Cianorte
    lng: -52.6056
  },
  bounds: {
    north: -22.8,
    south: -24.5,
    east: -51.5,
    west: -53.5
  }
};
