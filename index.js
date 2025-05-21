// Configuração do superagente de vendas para Construpiso com integração WhatsApp
// Utilizando BuilderBot - plataforma gratuita e open source

import { createBot, createProvider, createFlow, addKeyword, MemoryDB } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'

// Base de conhecimento - Catálogo de produtos
const catalogoProdutos = {
  pisos: {
    descricao: "A Construpiso é especialista em pisos e porcelanatos, oferecendo as melhores marcas do mercado com variedade de estilos, formatos e acabamentos.",
    exemplos: ["porcelanatos que reproduzem mármores", "porcelanatos que reproduzem madeiras", "porcelanatos que reproduzem pedras naturais"],
    beneficios: ["resistência superior", "durabilidade", "fácil limpeza", "valorização do imóvel"]
  },
  tintas: {
    descricao: "O departamento de tintas da Construpiso oferece soluções completas para pintura interna e externa.",
    exemplos: ["tintas acrílicas", "látex", "esmaltes", "vernizes", "texturas decorativas"],
    beneficios: ["maior cobertura", "rendimento superior", "durabilidade", "proteção UV para áreas externas"]
  },
  banheiro: {
    descricao: "A Construpiso dispõe de uma linha completa de louças sanitárias e acessórios para banheiros que combinam funcionalidade, economia e design.",
    exemplos: ["vasos sanitários", "cubas", "chuveiros", "boxes em vidro temperado"],
    beneficios: ["economia de água", "design diferenciado", "durabilidade", "facilidade de limpeza"]
  },
  hidraulicos: {
    descricao: "O departamento de materiais hidráulicos e elétricos da Construpiso oferece soluções completas para instalações residenciais e comerciais.",
    exemplos: ["tubos e conexões em PVC", "registros", "válvulas", "dispositivos para controle de fluxo"],
    beneficios: ["segurança", "durabilidade", "economia de água", "facilidade de instalação"]
  },
  argamassas: {
    descricao: "A Construpiso oferece uma linha completa de argamassas e impermeabilizantes para garantir a qualidade e durabilidade das construções.",
    exemplos: ["argamassas colantes", "rejuntes", "impermeabilizantes", "aditivos"],
    beneficios: ["proteção contra infiltrações", "durabilidade", "acabamento perfeito", "resistência"]
  }
}

// Histórias de sucesso para storytelling
const historiasClientes = [
  {
    tipo: "consumidor_final",
    historia: "Recentemente atendemos um cliente que estava reformando um apartamento na praia. Ele inicialmente considerava usar porcelanato comum no banheiro, preocupado principalmente com o orçamento. Após nossa consultoria, ele optou pelo porcelanato retificado com tratamento nanotecnológico que recomendamos, mesmo sendo 30% mais caro inicialmente. Seis meses depois, ele nos ligou especificamente para agradecer, pois enquanto os vizinhos já enfrentavam problemas de manchas e mofo nos rejuntes devido à umidade marítima, o banheiro dele permanecia impecável, sem nenhuma manutenção especial."
  },
  {
    tipo: "profissional",
    historia: "Uma arquiteta que trabalha com projetos residenciais de alto padrão estava buscando revestimentos diferenciados para um cliente exigente. Apresentamos nossa linha de porcelanatos de grande formato que reproduzem mármores italianos. Além da beleza estética, destacamos as vantagens técnicas: menor número de rejuntes, facilidade de limpeza e manutenção, e custo significativamente menor que o mármore natural. O projeto foi um sucesso, rendendo à arquiteta novos clientes que visitaram a casa e se encantaram com o resultado."
  },
  {
    tipo: "empresa",
    historia: "Uma construtora local estava com dificuldades para encontrar um fornecedor confiável para um grande empreendimento com 120 apartamentos. Eles precisavam de um parceiro que garantisse não só preço competitivo, mas principalmente consistência na qualidade e cumprimento dos prazos de entrega. Desenvolvemos um pacote personalizado com condições especiais de pagamento e cronograma de entregas programadas. O resultado foi tão positivo que a construtora já nos procurou para o próximo empreendimento, aumentando inclusive o padrão dos acabamentos."
  }
]

// Fluxo 1: Boas-vindas e Qualificação Inicial
const boasVindasFlow = addKeyword(['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'inicio', 'começar', 'menu'])
  .addAnswer('Olá! Sou o Oaidson, consultor virtual da Construpiso. 😊 Estou aqui para ajudar você a encontrar os melhores materiais para sua construção ou reforma!')
  .addAnswer('Para começarmos com o pé direito, poderia me dizer seu nome completo?', { capture: true }, (ctx, { flowDynamic, state }) => {
    const nome = ctx.body
    state.update({ nome_cliente: nome })
    flowDynamic(`Muito prazer, ${nome}! É um prazer atender você.`)
  })
  .addAnswer('Você está buscando materiais para um projeto pessoal ou profissional? (Digite 1 para pessoal, 2 para profissional, ou 3 se representa uma empresa)', { capture: true }, (ctx, { flowDynamic, state }) => {
    let tipoCliente = ''
    
    if (ctx.body.includes('1') || ctx.body.toLowerCase().includes('pessoal')) {
      tipoCliente = 'consumidor_final'
      flowDynamic('Ótimo! Projetos pessoais são sempre especiais. Vamos encontrar os melhores materiais para tornar seu sonho realidade.')
    } else if (ctx.body.includes('2') || ctx.body.toLowerCase().includes('profissional')) {
      tipoCliente = 'profissional'
      flowDynamic('Excelente! Para profissionais como você, temos condições especiais e um atendimento técnico diferenciado.')
    } else if (ctx.body.includes('3') || ctx.body.toLowerCase().includes('empresa')) {
      tipoCliente = 'empresa'
      flowDynamic('Perfeito! Para empresas, oferecemos pacotes especiais, condições diferenciadas de pagamento e suporte dedicado.')
    } else {
      tipoCliente = 'consumidor_final'
      flowDynamic('Entendi! Vou considerar que é para um projeto pessoal. Vamos encontrar os melhores materiais para você.')
    }
    
    state.update({ tipo_cliente: tipoCliente })
  })
  .addAnswer('Você já conhece ou já comprou na Construpiso anteriormente? (Sim/Não)', { capture: true }, (ctx, { flowDynamic, state }) => {
    const conheceConstrupiso = ctx.body.toLowerCase().includes('sim') ? true : false
    state.update({ conhece_construpiso: conheceConstrupiso })
    
    if (conheceConstrupiso) {
      flowDynamic('Fico feliz que tenha voltado à Construpiso! Nosso objetivo é superar suas expectativas novamente e garantir que encontre exatamente o que precisa para seu projeto.')
    } else {
      flowDynamic('Seja bem-vindo à Construpiso! Somos especialistas em materiais de construção há mais de 33 anos, com foco especial em pisos e revestimentos. Nossa capacidade logística permite entregas em mais de 70 cidades e nosso compromisso é transformar seu projeto em realidade com produtos de qualidade superior.')
    }
  })
  .addAnswer('Agora me conte, qual tipo de projeto você está realizando? (Ex: construção nova, reforma completa, reforma de banheiro, etc.)', { capture: true }, (ctx, { flowDynamic, state }) => {
    const tipoProjeto = ctx.body.toLowerCase()
    state.update({ tipo_projeto: tipoProjeto })
    
    flowDynamic(`Entendi que você está trabalhando em ${tipoProjeto}. Isso vai me ajudar a recomendar os produtos mais adequados.`)
  })

// Fluxo 2: Identificação de Necessidades (SPIN)
const identificacaoNecessidadesFlow = addKeyword(['necessidades', 'continuar', 'prosseguir'])
  .addAnswer('Vamos entender melhor seu projeto para oferecer as melhores recomendações.')
  .addAnswer('Qual o tamanho aproximado da área que você está trabalhando? (em metros quadrados)', { capture: true }, (ctx, { state }) => {
    const tamanhoArea = ctx.body
    state.update({ tamanho_area: tamanhoArea })
  })
  .addAnswer('Quais são os principais desafios que você está enfrentando neste projeto?', { capture: true }, (ctx, { state }) => {
    const desafiosProjeto = ctx.body
    state.update({ desafios_projeto: desafiosProjeto })
  })
  .addAnswer('Qual é o prazo que você estabeleceu para a conclusão deste projeto? (Digite 1 para imediato - próximos 7 dias, 2 para curto prazo - até 30 dias, 3 para médio prazo - 1-3 meses, ou 4 para longo prazo - mais de 3 meses)', { capture: true }, (ctx, { flowDynamic, state }) => {
    let prazoProjeto = ''
    
    if (ctx.body.includes('1')) {
      prazoProjeto = 'imediato'
    } else if (ctx.body.includes('2')) {
      prazoProjeto = 'curto_prazo'
    } else if (ctx.body.includes('3')) {
      prazoProjeto = 'medio_prazo'
    } else if (ctx.body.includes('4')) {
      prazoProjeto = 'longo_prazo'
    } else {
      prazoProjeto = 'medio_prazo'
    }
    
    state.update({ prazo_projeto: prazoProjeto })
    flowDynamic(`Entendi que seu prazo é ${prazoProjeto}. Isso nos ajuda a planejar melhor as recomendações e entregas.`)
  })
  .addAnswer('Quais materiais específicos você está buscando para seu projeto?', { capture: true }, (ctx, { flowDynamic, state }) => {
    const produtosInteresse = ctx.body
    state.update({ produtos_interesse: produtosInteresse })
    
    // Identificar categorias de produtos mencionadas
    const categorias = []
    if (produtosInteresse.toLowerCase().includes('piso') || produtosInteresse.toLowerCase().includes('porcelanato') || produtosInteresse.toLowerCase().includes('revestimento')) {
      categorias.push('pisos')
    }
    if (produtosInteresse.toLowerCase().includes('tinta') || produtosInteresse.toLowerCase().includes('pintura')) {
      categorias.push('tintas')
    }
    if (produtosInteresse.toLowerCase().includes('banheiro') || produtosInteresse.toLowerCase().includes('vaso') || produtosInteresse.toLowerCase().includes('cuba')) {
      categorias.push('banheiro')
    }
    if (produtosInteresse.toLowerCase().includes('cano') || produtosInteresse.toLowerCase().includes('tubo') || produtosInteresse.toLowerCase().includes('hidraulic')) {
      categorias.push('hidraulicos')
    }
    if (produtosInteresse.toLowerCase().includes('argamassa') || produtosInteresse.toLowerCase().includes('rejunte') || produtosInteresse.toLowerCase().includes('impermeabilizante')) {
      categorias.push('argamassas')
    }
    
    state.update({ categorias_interesse: categorias })
    
    if (categorias.length > 0) {
      let resposta = 'Ótimo! Vejo que você está interessado em '
      categorias.forEach((categoria, index) => {
        if (index === 0) {
          resposta += catalogoProdutos[categoria].descricao
        } else {
          resposta += ` Também temos ${catalogoProdutos[categoria].descricao}`
        }
      })
      flowDynamic(resposta)
    } else {
      flowDynamic('Entendi seus interesses. A Construpiso tem um amplo catálogo de produtos que podem atender suas necessidades.')
    }
  })

// Fluxo 3: Apresentação de Soluções (Método Challenger)
const apresentacaoSolucoesFlow = addKeyword(['soluções', 'produtos', 'recomendações'])
  .addAnswer('Para que eu possa recomendar as melhores opções dentro da sua expectativa de investimento, você teria uma faixa de orçamento em mente para este projeto?', { capture: true }, (ctx, { state }) => {
    const orcamento = ctx.body
    state.update({ orcamento_aproximado: orcamento })
  })
  .addAnswer('Baseado nas informações que você compartilhou, gostaria de apresentar algumas perspectivas que talvez você não tenha considerado ainda.', null, async (ctx, { flowDynamic, state }) => {
    const categorias = state.get('categorias_interesse') || []
    const tipoCliente = state.get('tipo_cliente') || 'consumidor_final'
    
    // Selecionar história relevante para storytelling
    const historiaRelevante = historiasClientes.find(h => h.tipo === tipoCliente)
    
    if (categorias.length > 0) {
      // Para cada categoria de interesse, apresentar insights desafiadores
      for (const categoria of categorias) {
        await flowDynamic(`Muitos clientes inicialmente focam apenas no preço dos produtos de ${categoria}, sem considerar fatores importantes como:`)
        
        // Apresentar benefícios específicos da categoria
        let beneficiosTexto = ''
        catalogoProdutos[categoria].beneficios.forEach((beneficio, index) => {
          beneficiosTexto += `${index + 1}. ${beneficio}\n`
        })
        
        await flowDynamic(beneficiosTexto)
        
        // Apresentar história de sucesso relevante
        if (historiaRelevante) {
          await flowDynamic('Deixe-me compartilhar uma experiência real:')
          await flowDynamic(historiaRelevante.historia)
        }
      }
    } else {
      // Caso não tenha identificado categorias específicas
      await flowDynamic('Muitos clientes inicialmente focam apenas no preço inicial dos materiais, sem considerar o custo por ano de vida útil. Quando fazemos essa conta, frequentemente descobrimos que a opção aparentemente mais cara se torna na verdade a mais econômica ao longo do tempo.')
      
      // Apresentar história de sucesso genérica
      if (historiaRelevante) {
        await flowDynamic('Deixe-me compartilhar uma experiência real:')
        await flowDynamic(historiaRelevante.historia)
      }
    }
  })
  .addAnswer('Gostaria de receber mais informações sobre algum produto específico? (Digite o nome do produto ou "menu" para voltar ao início)', { capture: true })

// Fluxo 4: Fechamento e Próximos Passos
const fechamentoFlow = addKeyword(['finalizar', 'concluir', 'orçamento', 'comprar'])
  .addAnswer('Ótimo! Para finalizar seu atendimento e enviar um orçamento detalhado, preciso de algumas informações adicionais.')
  .addAnswer('Qual seria sua forma de pagamento preferida? (Digite 1 para à vista, 2 para cartão de crédito, 3 para crediário próprio)', { capture: true }, (ctx, { flowDynamic, state }) => {
    let formaPagamento = ''
    
    if (ctx.body.includes('1')) {
      formaPagamento = 'a_vista'
      flowDynamic('Excelente escolha! Para pagamentos à vista, oferecemos condições especiais com descontos atrativos.')
    } else if (ctx.body.includes('2')) {
      formaPagamento = 'cartao_credito'
      flowDynamic('Perfeito! Aceitamos os principais cartões de crédito, com opções de parcelamento em até 12 vezes.')
    } else if (ctx.body.includes('3')) {
      formaPagamento = 'crediario_proprio'
      flowDynamic('Ótimo! Nosso crediário próprio oferece condições facilitadas para sua compra.')
    } else {
      formaPagamento = 'a_definir'
      flowDynamic('Entendi! Podemos discutir as opções de pagamento em mais detalhes posteriormente.')
    }
    
    state.update({ forma_pagamento_preferida: formaPagamento })
  })
  .addAnswer('Para que eu possa verificar nosso prazo de entrega, poderia me informar o endereço completo onde os materiais deverão ser entregues?', { capture: true }, (ctx, { state }) => {
    const endereco = ctx.body
    state.update({ endereco_entrega: endereco })
  })
  .addAnswer('Qual o melhor número para contatá-lo? De preferência um celular com WhatsApp', { capture: true }, (ctx, { flowDynamic, state }) => {
    const telefone = ctx.body
    state.update({ telefone_contato: telefone })
    
    // Resumo do atendimento
    const nome = state.get('nome_cliente') || 'Cliente'
    const tipoProjeto = state.get('tipo_projeto') || 'seu projeto'
    
    flowDynamic(`${nome}, agradeço por escolher a Construpiso para ${tipoProjeto}! Um de nossos consultores entrará em contato em breve através do número ${telefone} para finalizar seu orçamento e esclarecer qualquer dúvida adicional.`)
  })
  .addAnswer('Enquanto isso, você pode visitar nossas lojas em Tianguá ou Sobral para conhecer pessoalmente nossos produtos. Nosso horário de funcionamento é de segunda a sexta, das 8h às 18h, e aos sábados, das 8h às 12h.')
  .addAnswer('Foi um prazer atendê-lo! Se precisar de mais alguma informação, é só me chamar. 😊')

// Fluxo 5: Informações sobre a Construpiso
const informacoesEmpresaFlow = addKeyword(['empresa', 'construpiso', 'sobre', 'lojas', 'endereço', 'horário'])
  .addAnswer('A Construpiso é uma loja especializada em materiais de construção com mais de 33 anos de atuação no mercado cearense, com lojas em Tianguá e Sobral.')
  .addAnswer('Somos reconhecidos como top of mind em Tianguá e nos destacamos pela especialização em pisos e revestimentos, que representam 70% das vendas, além de oferecermos um amplo mix de produtos para construção e reforma.')
  .addAnswer('Realizamos entregas em mais de 70 cidades, temos presença digital consolidada e recentemente ampliamos nosso espaço físico, triplicando a área de exposição de produtos.')
  .addAnswer('Nosso slogan "Erguendo Sonhos" reflete nosso compromisso com um atendimento humanizado e soluções completas para nossos clientes.')
  .addAnswer('Horário de funcionamento: Segunda a sexta, das 8h às 18h, e aos sábados, das 8h às 12h.')
  .addAnswer('Gostaria de conhecer mais sobre nossos produtos ou tirar alguma dúvida específica? (Digite "menu" para voltar ao início)', { capture: true })

// Fluxo Principal
const main = async () => {
  const adapterDB = new MemoryDB()
  const adapterFlow = createFlow([
    boasVindasFlow,
    identificacaoNecessidadesFlow,
    apresentacaoSolucoesFlow,
    fechamentoFlow,
    informacoesEmpresaFlow
  ])
  const adapterProvider = createProvider(BaileysProvider)

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })

  // Iniciar servidor HTTP na porta 3000
  httpServer(3000)
}

main()
