const incomesElement = document.querySelector(".incomes");
const expensesElement = document.querySelector(".expenses");
const totalElement = document.querySelector(".total");
const transactionList = document.querySelector(".tabela table tbody");
const descInput = document.querySelector("#desc");
const valueInput = document.querySelector("#value");
const typeInput = document.querySelector("#type");
const addButton = document.querySelector("#addButton");

let transactions = [];

function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const row = document.createElement("tr");

    const descCell = document.createElement("td");
    descCell.textContent = transaction.description;

    const valueCell = document.createElement("td");
    valueCell.textContent = `R$ ${transaction.value.toFixed(2)}`;
    valueCell.classList.add("columnAmount");

    const typeCell = document.createElement("td");
    typeCell.textContent = transaction.type === "income" ? "Entrada" : "Saída";
    typeCell.classList.add("columnType");

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.onclick = () => removeTransaction(index);
    actionCell.appendChild(deleteButton);

    row.appendChild(descCell);
    row.appendChild(valueCell);
    row.appendChild(typeCell);
    row.appendChild(actionCell);

    transactionList.appendChild(row);
  });
}

function addTransaction(event) {
  event.preventDefault();
  const description = descInput.value.trim();
  const value = parseFloat(valueInput.value);
  const type = typeInput.value;

  if (
    description &&
    !isNaN(value) &&
    (type === "income" || type === "expense")
  ) {
    const newTransaction = { description, value, type };
    transactions.push(newTransaction);
    updateTotals();
    renderTransactions();
    saveToLocalStorage();
    descInput.value = "";
    valueInput.value = "";
  } else {
    alert("Por favor, preencha todos os campos corretamente.");
  }
}

function removeTransaction(index) {
  transactions.splice(index, 1);
  updateTotals();
  renderTransactions();
  saveToLocalStorage();
}

function updateTotals() {
  const incomes = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.value, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.value, 0);
  const total = incomes - expenses;

  incomesElement.textContent = incomes.toFixed(2);
  expensesElement.textContent = expenses.toFixed(2);
  totalElement.textContent = total.toFixed(2);
}

function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("transactions");
  if (data) {
    transactions = JSON.parse(data);
    updateTotals();
    renderTransactions();
  }
}

addButton.addEventListener("click", addTransaction);
