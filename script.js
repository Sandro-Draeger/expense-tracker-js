// Modo Noturno
const modoNoturno = document.querySelector("#theme-toggle");

modoNoturno.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  modoNoturno.textContent = "🌞" === modoNoturno.textContent ? "🌛" : "🌞";
});

// Gerenciamento de Despesas
const formulario = document.querySelector("#form-despesa");
const listaDespesas = document.querySelector("#lista-despesas");

// Envio do formulário
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  // Criando o item da lista
  const item = document.createElement("li");

  // Capturando os valores do formulário
  const descricao = formulario.elements.descricao.value;
  const valor = formulario.elements.valor.value;
  const selectedCategoria = formulario.elements.categoria.value;

  // Texto Descrição
  const textoDescricao = document.createElement("span");
  textoDescricao.className = "descricao";
  textoDescricao.textContent = descricao;

  // Texto Valor
  const textoValor = document.createElement("span");
  textoValor.className = "valor";
  textoValor.textContent = valor;
  textoValor.dataset.valor = parseFloat(valor); // Armazena o valor para calcular o total

  // Seleção da categoria
  const selectCategoria = document.createElement("select");
  selectCategoria.className = "categoria";
  selectCategoria.disabled = true;
  selectCategoria.innerHTML = `
    <option value="alimentacao">Alimentação</option>
    <option value="transporte">Transporte</option>
    <option value="entreterimento">Entreterimento</option>
    <option value="compras">Compras</option>
    <option value="contas">Contas</option>
    <option value="saude">Saúde</option>
    <option value="outros">Outros</option>
  `;
  selectCategoria.value = selectedCategoria;

  // Botão Editar
  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "✏️";

  // Botão Apagar
  const botaoApagar = document.createElement("button");
  botaoApagar.type = "button";
  botaoApagar.textContent = "❌";

  // Função Editar
  botaoEditar.addEventListener("click", function () {
    const estaEditando = item.classList.toggle("editando");
    // Alterna entre modos de edição e visualização usando o bolleano estaEditando
    if (estaEditando) {
      // Modo edição
      textoDescricao.contentEditable = "true";
      textoValor.contentEditable = "true";
      selectCategoria.disabled = false;

      botaoEditar.textContent = "✔";
    } else {
      // Modo salvar
      textoDescricao.contentEditable = "false";
      textoValor.contentEditable = "false";
      selectCategoria.disabled = true;

      botaoEditar.textContent = "✏️";

      let novoValor = textoValor.textContent.replace(",", ".");
      textoValor.dataset.valor = parseFloat(novoValor) || 0;
      calcularTotalCategoria();
    }
  });

  // função Apagar
  botaoApagar.addEventListener("click", function () {
    item.remove();
    calcularTotalCategoria();
  });

  // Monta o item
  item.appendChild(textoDescricao);
  item.appendChild(textoValor);
  item.appendChild(selectCategoria);
  item.appendChild(botaoEditar);
  item.appendChild(botaoApagar);

  filtroCategoria.value = "";
  filtroCategoria.dispatchEvent(new Event("change"));
  

  // Adiciona à lista
  listaDespesas.appendChild(item);

  // Cálculo do Total
  calcularTotalCategoria();

  // Limpa formulário
  formulario.reset();
});

// Função para atualizar o total das despesas
const totalValor = document.querySelector("#totalDespesas");

function atualizarTotal(total) {
  total = Number(total) || 0;

  totalValor.textContent = `€ ${total.toFixed(2)}`;
}

// Filtro por categoria
const filtroCategoria = document.querySelector("#filtroCategoria");

filtroCategoria.addEventListener("change", function () {
  // Obtém a categoria selecionada no filtro
  const categoriaSelecionada = filtroCategoria.value;
  // Percorre os itens da lista e ajusta a visibilidade
  for (const item of listaDespesas.children) {
    //chamar função e adicionar
    const categoriaItem = item.querySelector(".categoria").value;
    // Verifica se o item deve ser exibido
    if (categoriaSelecionada === "" || categoriaItem === categoriaSelecionada) {
      item.style.display = ""; // Exibe o item
    } else {
      item.style.display = "none"; // Oculta o item
    }
  }
});

// atualizar o total das POR CATEGORIA
function calcularTotalCategoria() {
  let total = 0;
  const categoriaSelecionada = filtroCategoria.value;
  //  Percorre os itens da lista e soma os valores
  for (const item of listaDespesas.children) {
    const categoriaItem = item.querySelector(".categoria").value;

    if (categoriaItem === categoriaSelecionada) {
      const valorItem = Number.parseFloat(
        item.querySelector(".valor").dataset.valor
      );
      total += valorItem;
    } else if (categoriaSelecionada === "") {
      const valorItem = Number.parseFloat(
        item.querySelector(".valor").dataset.valor
      );
      total += valorItem;
    }
  }
  atualizarTotal(total);
}

filtroCategoria.addEventListener("change", function () {
  calcularTotalCategoria();
});

//ATUALIZAÇÃO DE DATA E HORA
const dataHoraAtual = document.querySelector("#data-hora-atual");

function atualizarDataHora() {
  const opcoes = {
    year: "2-digit",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const dataAtualFormatada = new Date().toLocaleString("pt-PT", opcoes);
  dataHoraAtual.textContent = dataAtualFormatada;
}
atualizarDataHora();
//Intervalo para atualizar horário
setInterval(atualizarDataHora, 60000);

//API DE TEMPO
const weatherEl = document.querySelector("#weather");

fetch(
  "https://api.open-meteo.com/v1/forecast?latitude=41.1496&longitude=-8.6109&current_weather=true"
)
  .then((response) => response.json())
  .then((data) => {
    const temperatura = data.current_weather.temperature;
    weatherEl.textContent = `Porto: ${temperatura}°C`;
  });
