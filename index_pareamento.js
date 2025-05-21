// Versão modificada do superagente com melhor visualização do QR code
import { createBot, createProvider, createFlow, addKeyword, MemoryDB } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'

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
  .addAnswer('Você já conhece ou já comprou na Construpiso anteriormente? (Sim/Não)')

// Fluxo 2: Informações sobre a Construpiso
const informacoesEmpresaFlow = addKeyword(['empresa', 'construpiso', 'sobre', 'lojas', 'endereço', 'horário'])
  .addAnswer('A Construpiso é uma loja especializada em materiais de construção com mais de 33 anos de atuação no mercado cearense, com lojas em Tianguá e Sobral.')
  .addAnswer('Somos reconhecidos como top of mind em Tianguá e nos destacamos pela especialização em pisos e revestimentos, que representam 70% das vendas.')
  .addAnswer('Horário de funcionamento: Segunda a sexta, das 8h às 18h, e aos sábados, das 8h às 12h.')

// Fluxo Principal
const main = async () => {
  console.log("Iniciando superagente da Construpiso...")
  
  const adapterDB = new MemoryDB()
  const adapterFlow = createFlow([
    boasVindasFlow,
    informacoesEmpresaFlow
  ])
  
  // Configuração com modo de pareamento por número (mais fácil que QR code)
  const adapterProvider = createProvider(BaileysProvider, {
    usePairingCode: true
  })

  const { handleCtx, httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  })

  // Iniciar servidor HTTP na porta 3000
  httpServer(3000)
  
  console.log("==================== ATENÇÃO ====================")
  console.log("O CÓDIGO DE PAREAMENTO APARECERÁ ABAIXO")
  console.log("USE ESTE CÓDIGO NO SEU WHATSAPP EM:")
  console.log("WhatsApp > Menu > Dispositivos conectados > Vincular dispositivo")
  console.log("==================== ATENÇÃO ====================")
}

main()
