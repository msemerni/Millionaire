const create_el_box = document.querySelector("#create_el");
const container = document.querySelector("#container");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const signupBtn = document.querySelector("#signupBtn");
const loginInput = document.querySelector("#loginInput");
const passwordInput = document.querySelector("#passwordInput");
const nickInput = document.querySelector("#nickInput");
const usersBox = document.querySelector(".users-box");

getAllUsers();

//signup
const registerNewUser = async () => {
  fetch("/user/signup", {
    method: "POST",
    body: JSON.stringify({
      login: loginInput.value,
      password: passwordInput.value,
      nick: nickInput.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => { console.log(json) });
};

//login
const loginUser = async () => {
  fetch("/user/login", {
    method: "POST",
    body: JSON.stringify({
      login: loginInput.value,
      password: passwordInput.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => { console.log(json) });
};

//logout
const logoutUser = async () => {
  fetch(`/user/logout`)
    .then((response) => response.json())
    .then((json) => { console.log(json) });
};


loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  loginUser();
});

logoutBtn.addEventListener("click", function (e) {
  logoutUser();
});

signupBtn.addEventListener("click", function (e) {
  e.preventDefault();
  registerNewUser();
});

const renderUsers = (users) => {
  usersBox.innerText = "";
  users.map(user => renderUser(user));
}

const renderUser = (user) => {
  const userBtn = document.createElement("button");
  userBtn.classList = "btn btn-outline-secondary m-1"
  userBtn.innerText = `${user._id} - ${user.login}`;
  usersBox.append(userBtn);

  userBtn.addEventListener("click", (e) => {
    fetch(`/game/new/${user._id}`)
    .then((response) => response.json())
    .then((json) => console.log(json));
  });
}


async function getAllUsers()  {
  const response = await fetch(`/users`);
  let users = await response.json();
  console.log("dAtA",users);
  if (response.ok === true) {
    renderUsers(users);
  }
}

// const generateGameLink = async (gameLink) => {
//   fetch(`/game/new/${user._id}`)
//   .then((response) => response.json())
//   .then((json) => console.log(json));
// }

// const JoinGame = async (gameLink) => {
//   const response = await fetch(gameLink);
//   let gameLink = await response.json();
//   console.log("gameLink",gameLink);
//   if (response.ok === true) {
//     container.innerText = JSON.stringify(gameLink);
//   }
// }

const btnShowUsers = document.createElement("button");
btnShowUsers.innerText = "Show Users";
btnShowUsers.classList="btn btn-outline-success my-2"

// const btnCreateGameLink = document.createElement("button");
// btnCreateGameLink.innerText = "Create Game Link";
// btnCreateGameLink.classList="btn btn-outline-success my-2"

create_el_box.append(btnShowUsers);

btnShowUsers.addEventListener("click", getAllUsers);
// btnCreateGameLink.addEventListener("click", createGameLink);
