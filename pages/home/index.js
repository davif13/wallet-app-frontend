const onLogout = () => {
  localStorage.clear();
  window.open('../../index.html', "_self");
}

const onDeleteItem = async (id) => {
  try {
    const email = localStorage.getItem("@WalletApp:userEmail");
    await fetch(`https://mp-wallet-app-api.herokuapp.com/finances/${id}`,
    {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        email: email,
      },
    }
    );
    onLoadFinancesData();
  } catch (error) {
    alert("Erro ao deletar item.");
  }
}

const renderFinancesList = (data) => {
  const table = document.getElementById("finances-table");
  table.innerHTML = "";

  const tableHeader = document.createElement("tr");

  const titleElement = document.createElement("th");
  const titleText = document.createTextNode("Título");
  titleElement.appendChild(titleText);
  tableHeader.appendChild(titleElement);

  const categoryElement = document.createElement("th");
  const categoryText = document.createTextNode("Categoria");
  categoryElement.appendChild(categoryText);
  tableHeader.appendChild(categoryElement);

  const dateElement = document.createElement("th");
  const dateText = document.createTextNode("Data");
  dateElement.appendChild(dateText);
  tableHeader.appendChild(dateElement);

  const valueElement = document.createElement("th");
  const valueText = document.createTextNode("Valor");
  valueElement.className = 'center';
  valueElement.appendChild(valueText);
  tableHeader.appendChild(valueElement);

  const actionElement = document.createElement("th");
  const actionText = document.createTextNode("Ação");
  actionElement.className = 'right';
  actionElement.appendChild(actionText);
  tableHeader.appendChild(actionElement);

  table.appendChild(tableHeader);

  data.map ((item) => {
    const tableRow = document.createElement("tr");
    tableRow.className = 'mt smaller';

    // render title of item
    const titleTd = document.createElement("td");
    const titleText = document.createTextNode(item.title);
    titleTd.appendChild(titleText);
    tableRow.appendChild(titleTd);

    // render category of item
    const categoryTd = document.createElement("td");
    const categoryText = document.createTextNode(item.name);
    categoryTd.appendChild(categoryText);
    tableRow.appendChild(categoryTd);

    // render date of item
    const dateTd = document.createElement("td");
    const dateText = document.createTextNode(new Date(item.date).toLocaleDateString());
    dateTd.appendChild(dateText);
    tableRow.appendChild(dateTd);
    
    // render value of item
    const valueTd = document.createElement("td");
    const valueText = document.createTextNode(new Intl.NumberFormat(
      "pt-BR", 
      { style: "currency", currency: "BRL",})
      .format(item.value));
    valueTd.className = 'center';
    valueTd.appendChild(valueText);
    tableRow.appendChild(valueTd);

    // delete action
    const deleteTd = document.createElement("td");
    deleteTd.style.cursor = "pointer";
    deleteTd.style.color = "#5936CD"
    deleteTd.onclick = () => onDeleteItem(item.id);
    const deleteText = document.createTextNode("Deletar");
    deleteTd.className = 'right';
    deleteTd.appendChild(deleteText);
    tableRow.appendChild(deleteTd);

    // table append
    table.appendChild(tableRow);
  })
}

const renderFinanceElements = (data) => {
  const totalItems = data.length;
  const revenues = data
  .filter(item => Number(item.value) > 0)
  .reduce((acc, item) => acc + Number(item.value), 0);
  localStorage.setItem('@WalletApp:userRevenues', revenues);
  const expenses = data
  .filter(item => Number(item.value) < 0)
  .reduce((acc, item) => acc + Number(item.value), 0);
  localStorage.setItem('@WalletApp:userExpenses', expenses);
  const totalValue = revenues + expenses;

  // render total items
  const financeCard1 = document.getElementById("finance-card-1");
  financeCard1.innerHTML = "";

  const totalSubtextElement = document.createElement("h3");
  const totalSubtext = document.createTextNode("Total de Lançamentos")
  totalSubtextElement.appendChild(totalSubtext);
  financeCard1.appendChild(totalSubtextElement);

  const totalItemsElement = document.createElement("h1");
  const totalItemsText = document.createTextNode(totalItems);
  totalItemsElement.className = 'mt smaller';
  totalItemsElement.appendChild(totalItemsText);
  financeCard1.appendChild(totalItemsElement);

  // render revenues
  const financeCard2 = document.getElementById("finance-card-2");
  financeCard2.innerHTML = "";

  const revenuesSubtextElement = document.createElement("h3");
  const revenuesSubtext = document.createTextNode("Receitas")
  revenuesSubtextElement.appendChild(revenuesSubtext);
  financeCard2.appendChild(revenuesSubtextElement);

  const revenuesElement = document.createElement("h1");
  const revenuesText = document.createTextNode(
    new Intl.NumberFormat(
      "pt-BR", 
      { style: "currency", currency: "BRL",})
      .format(revenues));
  revenuesElement.className = 'mt smaller';
  revenuesElement.appendChild(revenuesText);
  financeCard2.appendChild(revenuesElement);

  // render expenses
  const financeCard3 = document.getElementById("finance-card-3");
  financeCard3.innerHTML = "";

  const expensesSubtextElement = document.createElement("h3");
  const expensesSubtext = document.createTextNode("Despesas")
  expensesSubtextElement.appendChild(expensesSubtext);
  financeCard3.appendChild(expensesSubtextElement);

  const expensesElement = document.createElement("h1");
  const expensesText = document.createTextNode(
    new Intl.NumberFormat(
      "pt-BR", 
      { style: "currency", currency: "BRL",})
      .format(expenses));
  expensesElement.className = 'mt smaller';
  expensesElement.appendChild(expensesText);
  financeCard3.appendChild(expensesElement);

  // render balance
  const financeCard4 = document.getElementById("finance-card-4");
  financeCard4.innerHTML = "";

  const totalValueSubtextElement = document.createElement("h3");
  const totalValueSubtext = document.createTextNode("Balanço")
  totalValueSubtextElement.appendChild(totalValueSubtext);
  financeCard4.appendChild(totalValueSubtextElement);

  const totalValueElement = document.createElement("h1");
  const totalValueText = document.createTextNode(
    new Intl.NumberFormat(
      "pt-BR", 
      { style: "currency", currency: "BRL",})
      .format(totalValue));
  totalValueElement.className = 'mt smaller';
  totalValueElement.style.color = '#5936CD';
  totalValueElement.appendChild(totalValueText);
  financeCard4.appendChild(totalValueElement);

  // render chart
  const chartScript = document.getElementById('chart-script');
  const chartElement = document.createElement('script');
  const chartText = document.createTextNode(`const myChart = document.getElementById('finance-chart');
  
  new Chart (
    myChart,
    {
      type: 'pie',
      data: {
        labels: ['Receitas', 'Despesas'],
        datasets: [{
          label: 'Receitas',
          data: [${revenues}, ${expenses}],
          backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)'],
          hoverOffset: 4
        }]
      }
    }
  );`)
  chartElement.appendChild(chartText);
  chartScript.appendChild(chartElement);
}

const onLoadFinancesData = async () => {
  try {
    const dateInputValue = document.getElementById("select-date").value;
    const email = localStorage.getItem("@WalletApp:userEmail");
    const result = await fetch (`https://mp-wallet-app-api.herokuapp.com/finances?date=${dateInputValue}`, { 
      method: 'GET',
      headers: {
      email: email,
      }, 
    }
  );
  const data = await result.json();
  renderFinanceElements(data);
  renderFinancesList(data);
  return data;
  } catch (error) {
    return { error };
  }
}

const onLoadUserInfo = () => {
  const email = localStorage.getItem("@WalletApp:userEmail");
  const name = localStorage.getItem("@WalletApp:userName");

  const navbarUserInfo = document.getElementById("navbar-user-container");
  const navbarUserAvatar = document.getElementById("navbar-user-avatar");

  // add user email to navbar
  const emailElement = document.createElement("p");
  const emailText = document.createTextNode(email);
  emailElement.className = "user-email";
  emailElement.appendChild(emailText);
  navbarUserInfo.appendChild(emailElement);

  // add logout link
  const logoutElement = document.createElement("a");
  logoutElement.onclick = () => onLogout();
  logoutElement.style.cursor = "pointer";
  const logoutText = document.createTextNode("sair");
  logoutElement.className = "logout-element";
  logoutElement.id = "logout-element";
  logoutElement.appendChild(logoutText);
  navbarUserInfo.appendChild(logoutElement);

  // add user first letter inside avatar
  const avatarElement = document.createElement("h3");
  const avatarText = document.createTextNode(name.charAt(0).toUpperCase());
  avatarElement.id = "avatar-element";
  avatarElement.appendChild(avatarText);
  navbarUserAvatar.appendChild(avatarElement);
}

const onLoadCategories = async () => {
  try {
    const categoriesSelect = document.getElementById("input-category");
    const response = await fetch('https://mp-wallet-app-api.herokuapp.com/categories');
    const categoriesResult = await response.json();
    categoriesResult.map((category) => {
      const option = document.createElement("option");
      const categoryText = document.createTextNode(category.name);
      option.id = `category_${category.id}`;
      option.value = category.id;
      option.appendChild(categoryText);
      categoriesSelect.appendChild(option);
    })
  } catch (error) {
    alert("Erro ao carregar categorias.");
  }
}

const onOpenModal = () => {
  const modal = document.getElementById('modal');
  modal.style.display = "flex";
}

const onCloseModal = () => {
  const modal = document.getElementById('modal');
  modal.style.display = "none";
}

const onCallAddFinance = async (data) => {
  try {
    
    const email = localStorage.getItem("@WalletApp:userEmail");

    const response = await fetch("https://mp-wallet-app-api.herokuapp.com/finances",
    {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        email: email,
      },
      body: JSON.stringify(data),
    }
    );

    const user = await response.json();
    return user;

  } catch (error) {
    return { error }
  }
};

const onCreateFinanceRelease = async (target) => {
  try {
    const title = target[0].value;
    const value = Number(target[1].value);
    const date = target[2].value;
    const category = Number(target[3].value);
    const result = await onCallAddFinance({
      title,
      value,
      date,
      category_id: category,
    });

    console.log(result);
    
    if (result.error) {
      alert("Erro ao adicionar novo dado financeiro.");
      return;
    }
    onCloseModal();
    onLoadFinancesData();
  } catch (error) {
    alert("Erro ao adicionar novo dado financeiro.");
  }
}

const setInitialDate = () => {
  const dateInput = document.getElementById("select-date");
  const nowDate = new Date().toISOString().split("T")[0];
  dateInput.value = nowDate;
  dateInput.addEventListener("change", () => {
    onLoadFinancesData();
  })
}

const logoutElementDisplay = () => {
  const logoutElement = document.getElementById('logout-element');

  if (logoutElement.style.display === "none") {
    logoutElement.style.display = "flex";
  } else {
    logoutElement.style.display = "none";
  }
}

const addAvatarListener = () => {
  const avatarElement = document.getElementById('avatar-element');

  avatarElement.addEventListener("click", logoutElementDisplay);
}

const removeAvatarListener = () => {
  const avatarElement = document.getElementById('avatar-element');

  avatarElement.removeEventListener("click", logoutElementDisplay);
}

const checkWindowSize = () => {
  const logoutElement = document.getElementById('logout-element');

  if (window.innerWidth <= 480) {
    addAvatarListener();
  } else {
    removeAvatarListener();
    logoutElement.style.display = "flex";
  }
} 

window.onload = () => {
  setInitialDate();
  onLoadUserInfo();
  onLoadFinancesData();
  onLoadCategories();
  checkWindowSize();

  const form = document.getElementById('form-finance-release')
  form.onsubmit = (event) => {
    event.preventDefault();
    onCreateFinanceRelease(event.target);
  }
}

window.addEventListener("resize", checkWindowSize);