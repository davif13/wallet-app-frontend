const renderFinancesList = (data) => {
  const table = document.getElementById("finances-table");
  /*
            <tr>
            <td>Item1</td>
            <td>Item2</td>
            <td>Item3</td>
            <td class="center">Item4</td>
            <td class="right">Item5</td>
          </tr>
  */
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
  const expenses = data
  .filter(item => Number(item.value) < 0)
  .reduce((acc, item) => acc + Number(item.value), 0);
  const totalValue = revenues + expenses;

  // render total items
  const financeCard1 = document.getElementById("finance-card-1");
  const totalItemsElement = document.createElement("h1");
  const totalItemsText = document.createTextNode(totalItems);
  totalItemsElement.className = 'mt smaller';
  totalItemsElement.appendChild(totalItemsText);
  financeCard1.appendChild(totalItemsElement);

  // render revenues
  const financeCard2 = document.getElementById("finance-card-2");
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

}

const onLoadFinancesData = async () => {
  try {
    const date = '2022-12-15';
    const email = localStorage.getItem("@WalletApp:userEmail");
    const result = await fetch (`https://mp-wallet-app-api.herokuapp.com/finances?date=${date}`, { 
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
  emailElement.appendChild(emailText);
  navbarUserInfo.appendChild(emailElement);

  // add logout link
  const logoutElement = document.createElement("a");
  const logoutText = document.createTextNode("sair");
  logoutElement.appendChild(logoutText);
  navbarUserInfo.appendChild(logoutElement);

  // add user first letter inside avatar
  const avatarElement = document.createElement("h3");
  const avatarText = document.createTextNode(name.charAt(0).toUpperCase());
  avatarElement.appendChild(avatarText);
  navbarUserAvatar.appendChild(avatarElement);
}

window.onload = () => {
  onLoadUserInfo();
  onLoadFinancesData();
}