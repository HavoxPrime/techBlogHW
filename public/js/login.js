async function loginFormHandler(event) {
  event.preventDefault();
  const username = document.querySelector("#username-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();
  console.log(username);
  console.log(password);

  //Conditional statement to check if username and password match in database
  if (username && password) {
    const response = await fetch("/api/users/signin", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    // console.log(response);
    if (response.ok) {
      document.location.replace("/");
    } else {
      alert("failed to log in");
    }
  }
}

document
  .querySelector("#login-form")
  .addEventListener("click", loginFormHandler);
