"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    "2024-05-18T21:31:17.178Z",
    "2024-05-23T07:42:02.383Z",
    "2024-05-28T09:15:04.904Z",
    "2024-06-01T10:17:24.185Z",
    "2024-06-05T14:11:59.604Z",
    "2024-06-10T17:01:17.194Z",
    "2024-06-11T18:36:17.929Z",
    "2024-06-12T08:51:36.790Z",
  ],
  currency: "RUB",
  locale: "pt-PT",
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,

  movementsDates: [
    "2024-05-01T13:15:33.035Z",
    "2024-05-30T09:48:16.867Z",
    "2024-05-25T06:04:23.907Z",
    "2024-05-25T14:18:46.235Z",
    "2024-06-03T16:33:06.386Z",
    "2024-06-08T14:43:26.374Z",
    "2024-06-10T18:49:59.371Z",
    "2024-06-12T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,

  movementsDates: [
    "2023-11-01T13:15:33.035Z",
    "2023-11-30T09:48:16.867Z",
    "2024-05-25T06:04:23.907Z",
    "2024-05-25T14:18:46.235Z",
    "2024-06-07T16:33:06.386Z",
    "2024-06-10T14:43:26.374Z",
    "2024-06-11T18:49:59.371Z",
    "2024-06-12T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "es-PE",
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,

  movementsDates: [
    "2023-11-01T13:15:33.035Z",
    "2023-11-30T09:48:16.867Z",
    "2023-12-25T06:04:23.907Z",
    "2024-06-09T14:18:46.235Z",
    "2024-06-12T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "ru-RU",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

function formatDisplayDate(date) {
  const calcDaysPassed = function (date1, date2) {
    return Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Сегодня";
  if (daysPassed === 1) return "Вчера";
  if (daysPassed >= 2 && daysPassed <= 4) return `Прошло ${daysPassed} дня `;
  if (daysPassed >= 5 && daysPassed <= 7) return `Прошло ${daysPassed} дней `;

  const nowYear = date.getFullYear();
  const nowMonth = `${date.getMonth() + 1}`.padStart(2, 0);
  const nowDay = `${date.getDate()}`.padStart(2, 0);
  const nowHours = `${date.getHours()}`.padStart(2, 0);
  const nowMinutes = `${date.getMinutes()}`.padStart(2, 0);
  return `${nowDay}/${nowMonth}/${nowYear} ${nowHours}:${nowMinutes}`;
}

// Выведение всех операций
function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (value, i) {
    const typeOfTransaction = value > 0 ? "зачисление" : "снятие";
    const type = value > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDisplayDate(date);
    const local = currentAccount.locale;
    const options = { style: "currency", currency: currentAccount.currency };
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${typeOfTransaction}
      </div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${Intl.NumberFormat(local, options).format(
        value
      )};
    </div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// Время - timeOut & Interval
function startLogOut() {
  let time = 600;
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${second}`;
    if (time == 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }
    time--;
  }
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

// Создание логинов
function createLogIn(accs) {
  accs.forEach(function (acc) {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (val) {
        return val[0];
      })
      .join("");
  });
}
createLogIn(accounts);

// Текущий баланс
function createBalanceLadel(acc) {
  acc.balance = acc.movements.reduce(function (acc, val, key) {
    return acc + val;
  });

  const local = currentAccount.locale;
  const options = { style: "currency", currency: currentAccount.currency };
  labelBalance.textContent = Intl.NumberFormat(local, options).format(
    acc.balance
  );
  labelSumInterest.textContent = Intl.NumberFormat(local, options).format(
    acc.balance
  );
}

// Приход и уход
function SummInOutCalc(movements) {
  const sumComFilt = movements
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val);
  const sumOutFilt = movements
    .filter((val) => val < 0)
    .reduce((acc, val) => acc + val);
  const local = currentAccount.locale;
  const options = { style: "currency", currency: currentAccount.currency };
  labelSumIn.textContent = Intl.NumberFormat(local, options).format(sumComFilt);
  labelSumOut.textContent = Intl.NumberFormat(local, options).format(
    sumOutFilt
  );
}

// Функция с функциями
function updateUi(acc) {
  displayMovements(acc);
  createBalanceLadel(acc);
  SummInOutCalc(acc.movements);
}

// Вход в тот или иной аккаунт
let currentAccount;
let timer;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault("");
  currentAccount = accounts.find(function (acc) {
    return acc.logIn === inputLoginUsername.value;
  });
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = "";
    const local = navigator.language;
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "long",
      hour12: false,
    };

    labelDate.textContent = Intl.DateTimeFormat(local, options).format(
      new Date()
    );
    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOut();
    updateUi(currentAccount);
  }
});

//Перевод денег
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const reciveAcc = accounts.find(function (acc) {
    return acc.logIn === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);
  console.log(amount, reciveAcc);

  if (
    reciveAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciveAcc.logIn !== currentAccount.logIn
  ) {
    currentAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    updateUi(currentAccount);
  }
  clearInterval(timer);
  timer = startLogOut();
  inputTransferAmount.value = inputTransferTo.value = "";
});

//Закрытие аккаунта
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.logIn === currentAccount.logIn;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

//внесение денег
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0) {
    currentAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  clearInterval(timer);
  timer = startLogOut();
  inputLoanAmount.value = "";
});

// Сумма всех денег на всех аккаунтах
const accMov = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov);
console.log(accMov);

// Реализация фильтра
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Изменение формата показа валюты
labelBalance.addEventListener("click", function () {
  Array.from(document.querySelectorAll(".movements__value"), function (val, i) {
    return (val.innerText = val.textContent.replace("₽", " RUB"));
  });
});
