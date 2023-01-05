const gameName = "quiz";

const $create_el_box = document.querySelector("#create_el");
const $container = document.querySelector("#container");
const $loginBtn = document.querySelector("#loginBtn");
const $logoutBtn = document.querySelector("#logoutBtn");
const $signupBtn = document.querySelector("#signupBtn");
const $loginInput = document.querySelector("#loginInput");
const $passwordInput = document.querySelector("#passwordInput");
const $nickInput = document.querySelector("#nickInput");
const $usersBox = document.querySelector(".users-box");
const $events = document.getElementById('events');

const socket = io();


const newItem = (content) => {
  const item = document.createElement('li');
  item.innerText = content;
  return item;
}

const renderUsers = (users) => {
  $usersBox.innerText = "";
  users.map(user => renderUser(user));
}

const renderUser = (user) => {
  const userBtn = document.createElement("button");
  userBtn.classList = "btn btn-outline-secondary m-1";
  userBtn.innerText = `${user._id} - ${user.login}`;
  $usersBox.append(userBtn);

  userBtn.addEventListener("click", async (e) => {
    const data = await fetch(`/game/new/${gameName}/${user._id}`);
    const json = await data.json();
    const gameLink = json.gameLink;

    socket.emit('create game', gameLink);

    $events.append(newItem(`${gameLink}`));

    console.log("GAME_LINK: ", gameLink);
  });
}

const getAllUsers = async () => {
  const response = await fetch(`/users`);
  let users = await response.json();
  // console.log("USERS", users);
  if (response.ok === true) {
    renderUsers(users);
  }
}

const registerNewUser = async () => {
  fetch("/user/signup", {
    method: "POST",
    body: JSON.stringify({
      login: $loginInput.value,
      password: $passwordInput.value,
      nick: $nickInput.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => { console.log(json) });
};

const loginUser = async () => {
  fetch("/user/login", {
    method: "POST",
    body: JSON.stringify({
      login: $loginInput.value,
      password: $passwordInput.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => { console.log(json) });
};

const logoutUser = async () => {
  fetch(`/user/logout`)
    .then((response) => response.json())
    .then((json) => { console.log(json) });
};

$loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  loginUser();
});

$logoutBtn.addEventListener("click", function (e) {
  logoutUser();
});

$signupBtn.addEventListener("click", function (e) {
  e.preventDefault();
  registerNewUser();
});

const btnShowUsers = document.createElement("button");
btnShowUsers.innerText = "Show Users";
btnShowUsers.classList = "btn btn-outline-success my-2";
btnShowUsers.addEventListener("click", getAllUsers);

$create_el_box.append(btnShowUsers);

getAllUsers();


//// Socket connection:
socket.on('connect', () => {
  $events.append(newItem(`Connected to socket: ${socket.id}`));
});

socket.on('game created', (userName, gameUUID) => {
  $events.append(newItem(`${userName} created game : ${gameUUID}`));
});

socket.on('user connected', (userName, gameName, gameUUID) => {
  $events.append(newItem(`${userName} connected to game : ${gameUUID}`));
  window.location.href = `http://localhost:8002/${gameName}/${gameUUID}`;
});

// history.pushState(null, null, window.location.href = `/#/active`);
