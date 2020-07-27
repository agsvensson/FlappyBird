console.log('[DevSoutinho] Flappy Bird');

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
const chao = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
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
      if (fazColisao(flappyBird, chao)) {
        console.log('Fez colisão');
        somHit.play();

        setTimeout(() => {
          mudaParaTela(Telas.INICIO);
        }, 500);
        return;
      }
  
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade; // faz ele cair
    },
    desenha() {     // quando quiser desenhar o Flappy Bird
      contexto.drawImage(
        sprites,
        flappyBird.spriteX, flappyBird.spriteY,   // Sprite X, Sprite Y
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
    },
    desenha() {
      planoDeFundo.desenha(); // chamar a função de desenho
      chao.desenha();
      globais.flappyBird.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {

    }
  }
};

Telas.JOGO = {
  desenha() {
  planoDeFundo.desenha(); // chamar a função de desenho
  chao.desenha();
  globais.flappyBird.desenha();
},
click() {
  globais.flappyBird.pula();
},
  atualiza() {
    globais.flappyBird.atualiza();
    }
  };

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();    

  requestAnimationFrame(loop); // função para sempre chamar a animação na tela
}

window.addEventListener('click', function() {
  if (telaAtiva.click) {
    telaAtiva.click();
  };
});

mudaParaTela(Telas.INICIO);
loop();