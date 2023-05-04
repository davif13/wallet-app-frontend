const validateUser = async (email) => {
  try {
    const result = await fetch(`https://mp-wallet-app-api.herokuapp.com/users?email=${email}`);
    const user = await result.json();
    return user;
  } catch (error) {
    return { error };
  }
}

onClickLogin = async () => {
  const email = document.getElementById("input-email").value;
  if (email.length < 5 || !email.includes("@")) {
    alert("E-mail inválido");
    return;
  }
  const result = await validateUser(email);
  console.log(result);
  if (result.error) {
    alert("Falha na ao validar e-mail");
    return;
  }
  localStorage.setItem("@WalletApp:userEmail", result.email);
  localStorage.setItem("@WalletApp:userName", result.name);
  localStorage.setItem("@WalletApp:userId", result.id);
  window.open("./pages/home/index.html", "_self");
}

window.onload = () => {
  const emailInput = document.getElementById("input-email");

  emailInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onClickLogin();
    }
  })
}