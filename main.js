// setup canvas
//Esse script obtém uma referência ao elemento <canvas> e, em seguida, chama o método getContext() para nos fornecer um contexto no qual podemos começar a desenhar. A variável resultante (ctx) é o objeto que representa diretamente a área de desenho da tela e nos permite desenhar formas 2D nela.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//Em seguida, definimos variáveis chamadas width e height, e a largura e altura do elemento canvas (representado pelas propriedades canvas.width e canvas.height) para igualar a largura e a altura da viewport do navegador (a área em que a página da Web aparece — isso pode ser obtido das propriedades Window.innerWidth e Window.innerHeight ).
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number
//Essa função usa dois números como argumentos e retorna um número aleatório no intervalo entre os dois.
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

/*Usando esta função, podemos dizer a nossa bola para desenhar-se na tela, chamando uma série de membros do contexto de tela 2D que definimos anteriormente (ctx). O contexto é como o papel, e agora queremos comandar nossa caneta para desenhar algo nela:

Primeiro, usamos beginPath() para declarar que queremos desenhar uma forma no papel.
Em seguida, usamos fillStyle para definir a cor que queremos que a forma seja — nós a definimos como a propriedade color da nossa bola.
Em seguida, usamos o método  arc() para traçar uma forma de arco no papel. Seus parâmetros são:
A posição x e y do centro do arco — estamos especificando as propriedades x e y da nossa bola.
O raio do nosso arco — estamos especificando a propriedade size  da nossa bola.
Os dois últimos parâmetros especificam o número inicial e final de graus em volta do círculo em que o arco é desenhado entre eles. Aqui nós especificamos 0 graus e 2 * PI, que é o equivalente a 360 graus em radianos (irritantemente, você tem que especificar isso em radianos). Isso nos dá um círculo completo. Se você tivesse especificado apenas 1 * PI, você obteria um semicírculo (180 graus).
Por último, usamos o método fill(), que basicamente diz "terminar de desenhar o caminho que começamos com beginPath(), e preencher a área que ocupa com a cor que especificamos anteriormente em fillStyle."*/

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

//Cria uma nova instância da bola
//Quando você entra na última linha, você deve ver a bola se desenhando em algum lugar na sua tela.
let testBall = new Ball(50, 100, 4, 4, "blue", 10);
testBall.x;
testBall.size;
testBall.color;
testBall.draw();

/*As primeiras quatro partes da função verificam se a bola atingiu a borda da tela. Se tiver, invertemos a polaridade da velocidade relevante para fazer a bola viajar na direção oposta. Assim, por exemplo, se a bola estava viajando para cima (positivo velY), então a velocidade vertical é alterada de forma que ela comece a viajar para baixo (negativo velY).

Nos quatro casos, estamos verificando se:

Se a coordenada x é maior que a largura da tela (a bola está saindo da borda direita).
Se a coordenada x é menor que 0 (a bola está saindo da borda esquerda).
Se a coordenada y é maior que a altura da tela (a bola está saindo da borda inferior).
Se a coordenada y é menor que 0 (a bola está saindo da borda superior).
Em cada caso, estamos incluindo o size da bola no cálculo, porque as coordenadas x/y estão no centro da bola, mas queremos que a borda da bola saia do perímetro — não queremos a bola para fique no meio da tela antes de quicar de volta.

As duas últimas linhas adicionam o valor velX à coordenada x, e o valor velY à coordenada y —  a bola é efitivamente movida cada vez que este método é chamado.

Isso é o que será feito por ora; vamos continuar com alguma animação!*/
Ball.prototype.update = function() {
  if (this.x + this.size >= width) {
    this.velX = -this.velX;
  }

  if (this.x - this.size <= 0) {
    this.velX = -this.velX;
  }

  if (this.y + this.size >= height) {
    this.velY = -this.velY;
  }

  if (this.y - this.size <= 0) {
    this.velY = -this.velY;
  }

  this.x += this.velX;
  this.y += this.velY;

  /*Para cada bola, precisamos checar todas as outras bolas para ver se ela colidiu com a bola atual. Para fazer isso, abrimos outro loop for para percorrer todas as bolas no array balls[].
Imediatamente dentro de nosso loop for, usamos uma instrução  if para verificar se a bola atual em loop é a mesma bola que estamos verificando no momento. Não queremos verificar se uma bola colidiu consigo mesma! Para fazer isso, verificamos se a bola atual (ou seja, a bola cujo método collisionDetect está sendo invocado) é a mesma que a bola de loop (ou seja, a bola que está sendo referenciada pela iteração atual do loop for no collisionDetect método). Nós então usamos ! para negar a verificação, para que o código dentro da instrução if seja executado apenas se eles não forem iguais.
Em seguida, usamos um algoritmo comum para verificar a colisão de dois círculos. Estamos basicamente verificando se alguma das áreas dos dois círculos se sobrepõe. Isso é explicado ainda mais na 2D collision detection.
Se uma colisão for detectada, o código dentro da instrução if interna será executado. Neste caso, estamos apenas definindo a propriedade color de ambos os círculos para uma nova cor aleatória. Poderíamos ter feito algo muito mais complexo, como fazer com que as bolas saltassem umas das outras de forma realista, mas isso teria sido muito mais complexo de implementar. Para essas simulações físicas, os desenvolvedores tendem a usar jogos ou bibliotecas físicas, como PhysicsJS, matter.js, Phaser, etc.*/
  Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color =
            "rgb(" +
            random(0, 255) +
            "," +
            random(0, 255) +
            "," +
            random(0, 255) +
            ")";
        }
      }
    }
  };
};

/*Primeiro, precisamos de um lugar para armazenar todas as nossas bolas. O array a seguir fará esse trabalho — adicione-o ao final do seu código agora:*/
let balls = [];

/*Nossa função loop() faz o seguinte:

Define a cor de preenchimento da tela como preto semitransparente e desenha um retângulo com a cor em toda a largura e altura da tela, usando fillRect() (os quatro parâmetros fornecem uma coordenada de início e uma largura e altura para o retângulo desenhado ). Isso serve para encobrir o desenho do quadro anterior antes que o próximo seja desenhado. Se você não fizer isso, você verá apenas longas cobras se movimentando ao redor da tela, em vez de mover as bolas! A cor do preenchimento é definida como semitransparente, rgba(0,0,0,0.25), para permitir que os poucos quadros anteriores brilhem levemente, produzindo as pequenas trilhas atrás das bolas à medida que elas se movem. Se você mudou 0,25 para 1, você não vai mais vê-los. Tente variar esse número para ver o efeito que ele tem.
Cria uma nova instância de nossa  Ball() usando valores aleatórios gerados com a nossa função  random() então push()para o final de nosso array de bolas, mas somente enquanto o número de bolas no array é menor que 25. Então quando temos 25 bolas na tela, não aparecem mais bolas. Você pode tentar variar o número emballs.length < 25 para obter mais ou menos bolas na tela. Dependendo de quanto poder de processamento seu computador / navegador possui, especificar vários milhares de bolas pode retardar bastante a animação!
Faz um loop em todas as balls no array de bolas e executa a função draw() e update() de cada bola para desenhar cada uma delas na tela, depois faz as atualizações necessárias para a posição e a velocidade no tempo para o próximo quadro.
Executa a função novamente usando o método requestAnimationFrame() — quando esse método é executado constantemente e passa o mesmo nome de função, ele executará essa função um número definido de vezes por segundo para criar uma animação suave. Isso geralmente é feito de forma recursiva — o que significa que a função está chamando a si mesma toda vez que é executada, portanto, ela será executada repetidas vezes.
Por último mas não menos importante, adicione a seguinte linha à parte inferior do seu código — precisamos chamar a função uma vez para iniciar a animação.*/
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  while (balls.length < 25) {
    let size = random(10, 20);
    let ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      "rgb(" +
        random(0, 255) +
        "," +
        random(0, 255) +
        "," +
        random(0, 255) +
        ")",
      size
    );
    balls.push(ball);
  }

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();
