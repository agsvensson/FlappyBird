let frames = 0;
const somHit = new Audio();
somHit.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// PLANO DE FUNDO
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {     // quando quiser desenhar o plano de fundo
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height) // do ponto 0 x e ponto 0 y, tudo tem que ficar com a cor acima
    
    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,   // Sprite X, Sprite Y
      planoDeFundo.largura, planoDeFundo.altura,   // Tamanho do recorte na Sprite
      planoDeFundo.x, planoDeFundo.y,  // Dentro do canvas, como quer desenhar
      planoDeFundo.largura, planoDeFundo.altura,   // Dentro do canvas, o tamanho da Sprite
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,   // para resolver o problema da imagem que não ocupa toda a largura
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// CHÃO
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      chao.x = movimentacao % repeteEm;
    },
    desenha() {     // quando quiser desenhar o chão
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,   // Sprite X, Sprite Y
        chao.largura, chao.altura,   // Tamanho do recorte na Sprite
        chao.x, chao.y,  // Dentro do canvas, como quer desenhar
        chao.largura, chao.altura,   // Dentro do canvas, o tamanho da Sprite
      );
  
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,   // Sprite X, Sprite Y
        chao.largura, chao.altura,   // Tamanho do recorte na Sprite
        (chao.x + chao.largura), chao.y,  // para resolver o problema da imagem que não ocupa toda a largura
        chao.largura, chao.altura,   // Dentro do canvas, o tamanho da Sprite
      );
    },
  };
  return chao;
}


// FLAPPY BIRD
function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }

  return false;
}

function criaFlappyBird() {
  const flappyBird = {    // estrutura que representa o Flappy Bird
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula() {
      console.log('devo pular');
      console.log('[antes]', flappyBird.velocidade);
      flappyBird.velocidade = - flappyBird.pulo;
      console.log('[depois]', flappyBird.velocidade);
    },
    gravidade: 0.25,
    velocidade: 0,
    atualiza() {
      if (fazColisao(flappyBird, globais.chao)) {
        console.log('Fez colisão');
        somHit.play();

        setTimeout(() => {
          mudaParaTela(Telas.INICIO);
        }, 200);
        return;
      }

      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade; // faz ele cair
    },
    movimentos: [
      {spriteX: 0, spriteY: 0, }, // asa para cima
      {spriteX: 0, spriteY: 26, }, // asa no meio
      {spriteX: 0, spriteY: 52, }, // asa para baixo
      {spriteX: 0, spriteY: 26, }, // asa no meio
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao
      }
    },
    desenha() {     // quando quiser desenhar o Flappy Bird
      flappyBird.atualizaOFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];   // desestruturar itens
      
      contexto.drawImage(
        sprites,
        spriteX, spriteY,   // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura,   // Tamanho do recorte na Sprite
        flappyBird.x, flappyBird.y,  // Dentro do canvas, como quer desenhar
        flappyBird.largura, flappyBird.altura,   // Dentro do canvas, o tamanho da Sprite
      );
    } 
  }
  return flappyBird;
};


// INÍCIO
const mensagemGetReady = {    // estrutura que representa o Flappy Bird
  spriteX: 134,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x: (canvas.width / 2 ) - 174 / 2,
  y: 50, 
  desenha() {     
    contexto.drawImage(
      sprites,
      mensagemGetReady.spriteX, mensagemGetReady.spriteY, 
      mensagemGetReady.largura, mensagemGetReady.altura, 
      mensagemGetReady.x, mensagemGetReady.y, 
      mensagemGetReady.largura, mensagemGetReady.altura,
    );
  }
}

// CANOS
function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {
      canos.pares.forEach(function(par) {
      const yRandom = par.y;
      const espacamentoEntreCanos = 90;

      // CANO DO CÉU
      const canoCeuX = par.x;
      const canoCeuY = yRandom;
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )

        // CANO DO CHÃO
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        contexto.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },

     temColisaoComOFlappyBird(par) {
        const cabecaDoFlappy = globais.flappyBird.y;
        const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
        
        if(globais.flappyBird.x >= par.x) {
          if(cabecaDoFlappy <= par.canoCeu.y) {
            return true;
          }

          if(peDoFlappy >= par.canoChao.y) {
            return true;
          }
        }
        return false;
      },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames) {
          canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      } 

      canos.pares.forEach(function(par) {
        par.x = par.x -2;

        if(canos.temColisaoComOFlappyBird(par)) {
          console.log('Você perdeu');          
          mudaParaTela(Telas.INICIO);
        }

        if(par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });

    }
  }

  return canos;
}

// TELAS

const globais = {};
let telaAtiva = {};
  function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
       telaAtiva.inicializa();
    }
}
const Telas = {
  INICIO: {     // adiciona um valor novo dentro de tela
    inicializa() {
     globais.flappyBird = criaFlappyBird();
     globais.chao = criaChao();
     globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha(); // chamar a função de desenho
      globais.flappyBird.desenha();
      globais.chao.desenha();     
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
};

Telas.JOGO = {
  desenha() {
  planoDeFundo.desenha(); // chamar a função de desenho
  globais.canos.desenha();
  globais.chao.desenha();
  globais.flappyBird.desenha();
},
click() {
  globais.flappyBird.pula();
},
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
    }
  };

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza(); 

  frames = frames + 1;
  requestAnimationFrame(loop); // função para sempre chamar a animação na tela
}

window.addEventListener ('keypress', (event) => {
  const keyCode = event.keyCode;
  switch (keyCode) {
    case 32:
        if(telaAtiva.click) {
          telaAtiva.click();
        }
      break;
  }

});

mudaParaTela(Telas.INICIO);
loop();