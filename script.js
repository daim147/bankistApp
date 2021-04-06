'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Husnain Syed',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-10-18T21:31:17.178Z',
    '2019-11-21T07:37:02.383Z',
    '2020-01-22T10:25:36.790Z',
    '2020-01-01T23:32:37.929Z',
    '2020-02-17T17:01:37.194Z',
    '2021-03-30T14:17:49.604Z',
    '2021-04-04T09:15:04.904Z',
    '2021-04-05T10:19:21.185Z',
  ],
};

const account2 = {
  owner: 'Arslan Syed',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-12-23T07:42:02.383Z',
    '2019-11-18T21:31:17.178Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-03-30T14:17:49.604Z',
    '2021-04-04T09:15:04.904Z',
    '2021-04-05T10:19:21.185Z',
  ],
};

const account3 = {
  owner: 'Mohsin Raza',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-01-11T21:19:11.178Z',
    '2020-02-32T07:54:20.383Z',
    '2020-05-08T09:11:02.904Z',
    '2020-08-21T10:17:21.185Z',
    '2020-09-08T14:11:59.604Z',
    '2021-03-30T14:17:49.604Z',
    '2021-04-04T09:15:04.904Z',
    '2021-04-05T10:19:21.185Z',
  ],
};

const account4 = {
  owner: 'Ayaz Hassan',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-03-30T14:17:49.604Z',
    '2021-04-04T09:15:04.904Z',
    '2021-04-05T10:19:21.185Z',
  ],
};
const account5 = {
  owner: 'Ibrahim Syed',
  movements: [430, 1000, 700, 50, 90, 800, -3000, 5000],
  interestRate: 1,
  pin: 5555,
  movementsDates: [
    '2019-09-11T21:21:19.178Z',
    '2019-10-11T07:12:73.383Z',
    '2020-11-02T09:35:27.904Z',
    '2020-04-02T10:48:33.185Z',
    '2020-05-08T14:22:51.604Z',
    '2021-03-30T14:17:49.604Z',
    '2021-04-04T09:15:04.904Z',
    '2021-04-05T10:19:21.185Z',
  ],
};

let accounts = [account1, account2, account3, account4, account5];

function updateLocalStorage() {
  if (JSON.parse(localStorage.getItem('accounts'))) {
    accounts = JSON.parse(localStorage.getItem('accounts'));
  }
}
updateLocalStorage();

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnSort = document.querySelector('.btn--sort');
const nav = document.querySelector('nav');
const formlogin = document.querySelector('.login');
const formTransfer = document.querySelector('.form--transfer');
const formClose = document.querySelector('.form--close');
const formloan = document.querySelector('.form--loan');
const inputTransferAmount = document.querySelector('.form__input--amount');
const locale = navigator.language;

// Date Format
const dateFormat = date => {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const now = new Date();
  const dayPassed = calcDayPassed(date, now);
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ag0`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Number Format
const numberFormat = (value, local = locale, currency = 'PKR') => {
  return new Intl.NumberFormat(local, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// LogOUT Timer
const logout = () => {
  // Set time to 5 minutes
  let time = 5 * 60;
  // Calling function imediately
  const timeForTimer = () => {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time
    labelTimer.textContent = `${min}:${sec}`;
    // When 0 seconds, stop timer logout
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = `0`;
      nav.classList.add('loged');
    }
    // Decrease 1s
    time--;
  };
  timeForTimer();
  // Call timer every second
  const timer = setInterval(timeForTimer, 1000);

  return timer;
};

// Displaying Movement

const displayMovement = function (acc, sorts = false) {
  containerMovements.innerHTML = '';
  const sorted = sorts
    ? acc.movements.slice().sort((a, b) => b - a)
    : acc.movements;
  sorted.forEach((movement, i) => {
    const type = movement > 0 ? `deposit` : `withdrawal`;
    const date = new Date(acc.movementsDates[i]);
    const displayDate = dateFormat(date);
    const numberFormated = numberFormat(movement);

    const html = ` 
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${numberFormated}</div>
      </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// USername into small case

const createUsername = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
  localStorage.setItem('accounts', JSON.stringify(accounts));
};
createUsername(accounts);

// Adding All movement to get Balance

const calcPrintbalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${numberFormat(acc.balance)}`;
  inputTransferAmount.setAttribute('max', acc.balance);
  localStorage.setItem('accounts', JSON.stringify(accounts));
};

// Getting Summary of All deposite , Withdraw

const calcSummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${numberFormat(incomes)}`;

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${numberFormat(Math.abs(outcome))}`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest);

  labelSumInterest.textContent = `${numberFormat(interest)}`;
};

// Update Ui

const updateUI = (acc = currentAccount) => {
  formlogin.reset();
  formTransfer.reset();
  formloan.reset();
  // Display movements
  displayMovement(acc);
  // Display Balance
  calcPrintbalance(acc);
  // Display Summary
  calcSummary(acc);
};

let currentAccount, timer;

// Event Handlers LogIN
formlogin.addEventListener('submit', e => {
  e.preventDefault();
  currentAccount = accounts.find(acc => {
    return (
      (acc.owner.toLocaleLowerCase() ===
        e.srcElement[0].value.toLocaleLowerCase() ||
        acc.username === e.srcElement[0].value.toLocaleLowerCase()) &&
      acc.pin == +e.srcElement[1].value
    );
  });
  if (currentAccount) {
    // Display UI and welcome Messege
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = `1`;
    nav.classList.remove('loged');
    // Current Date
    const now = new Date();
    const option = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(locale, option).format(now);
    if (timer) clearInterval(timer);
    timer = logout();
    updateUI();
  } else {
    labelWelcome.textContent = `Invalid Username or Pin`;
    containerApp.style.opacity = `0`;
    nav.classList.add('loged');
  }
});

// Form Transfer

formTransfer.addEventListener('submit', e => {
  e.preventDefault();
  const amountTransfer = +e.srcElement[1].value;
  const recieverAccount = accounts.find(acc => {
    return (
      acc.owner.toLocaleLowerCase() ===
        e.srcElement[0].value.toLocaleLowerCase() ||
      acc.username === e.srcElement[0].value.toLocaleLowerCase()
    );
  });
  // Checking if money is not tranfering to Current Account
  const isItmatch = Object.values(currentAccount).find(
    item => item === e.srcElement[0].value
  );
  if (recieverAccount && !isItmatch) {
    // Doing Transfer
    currentAccount.movements.push(-amountTransfer);
    recieverAccount.movements.push(amountTransfer);
    // Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());
    localStorage.setItem('accounts', JSON.stringify(accounts));

    // UpdateUI
    updateUI();
    // Reset Timer
    clearInterval(timer);
    timer = logout();
  }
});

// Request Loan
formloan.addEventListener('submit', e => {
  e.preventDefault();
  const loan = +e.srcElement[0].value;
  const loanAcceptance = currentAccount.movements.some(
    value => value >= loan / 10
  );
  if (loanAcceptance) {
    setTimeout(() => {
      currentAccount.movements.push(loan);
      // Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());
      localStorage.setItem('accounts', JSON.stringify(accounts));

      updateUI();
      // Reset Timer
      clearInterval(timer);
      timer = logout();
    }, 2000);
  }
});

//  Close Account
formClose.addEventListener('submit', e => {
  e.preventDefault();
  const closeAcccount = accounts.findIndex(acc => {
    return (
      (acc.owner.toLocaleLowerCase() ===
        e.srcElement[0].value.toLocaleLowerCase() ||
        acc.username === e.srcElement[0].value.toLocaleLowerCase()) &&
      acc.pin == +e.srcElement[1].value
    );
  });

  if (currentAccount === accounts[closeAcccount]) {
    // Delete Account
    accounts.splice(closeAcccount, 1);
    // Hiding UI
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = `0`;
    nav.classList.add('loged');
  }
});
// Sorting Array
let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovement(currentAccount, !sorted);
  sorted = !sorted;
});
