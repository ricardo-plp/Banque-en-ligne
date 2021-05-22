'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
//Exercice 1
const déposit = accounts
  .flatMap(acc => acc.movements)
  .filter(acc => acc > 0)
  .reduce((acr, ucr) => (acr += ucr), 0);
console.log(déposit);

//Exercice 2

// const depositSup = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc > 1000);

// console.log(depositSup.length);

//Exercice 3
// const { deposit, retrait } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, acc) => {
//       acc > 0 ? (sum.deposit += acc) : (sum.retrait += acc);
//       return sum;
//     },
//     { deposit: 0, retrait: 0 }
//   );

// const { depot, retrait } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sum, acc) => {
//       sum[acc > 0 ? 'depot' : 'retrait'] += acc;
//       return sum;
//     },
//     { depot: 0, retrait: 0 }
//   );
// console.log(depot, retrait);
//--------------------------

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

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Cette fonction sert a gerer les movements d'un compte et les afficher dans le container Movements (les depot et les retrait)
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //On commence par vider le container des mouvements de transactions

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    let type = mov > 0 ? 'deposit' : 'withdrawal'; // si le samme est superieur a 0 alors la transaction est un 'Deposit' depot si contraire c'est un 'withdrawal' Retrait

    /*Ici on copie le ficier html qui concerne le container movements et on modifie en rajoutant 
    le resultat obtenut dans l'élément type et on le stock dans une variable 'html' */
    const html = `<div class="movements__row">
<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                    <div class="movements__date">3 days ago</div>
                    <div class="movements__value">${mov}€</div>
                  </div>`;

    //On insert le code qui est stocker dans la variable 'html' avec la methode insertAdjacentHTML
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
//Cette fonction sert a afficher le totale des depot le totale des retrait et le totale des interet
const summaryValue = function (acc) {
  // la fonction a comme paramettre 'acc' celui si sera utiliser pour calculer les retrait ,depot,interet

  //summaryIn est egale a l'index 'movements' des objects 'accounts'
  const summaryIn = acc.movements
    //Dans la varible summaryIn(dépot)on filtre les transaction supperieur a 0 EURO avec la methode filter
    .filter(mov => mov > 0, 0)
    //On utilise la methode reduce pour additioner les transaction supereieur a 0 EURO
    .reduce((mov, acc) => mov + acc);
  //On affiche le resultat en fonction du compte dans la balise labelSumIn en fonction du compte connecter
  labelSumIn.textContent = `${summaryIn}€`;

  //summaryOut est egale a l'index 'movements' des objects 'accounts'
  const summaryOut = acc.movements
    //Dans la varible summaryOut(Retrait)on filtre les transaction Inferieur a 0 EURO avec la methode filter
    .filter(mov => mov < 0, 0)
    //On utilise la methode reduce pour additioner les transaction inferieur  a 0 EURO qui on ete filtrer précédament avec la methode filter
    .reduce((mov, acc) => mov + acc, 0);
  //On affiche le resultat en fonction du compte dans la balise labelSumIn en fonction du compte connecter
  labelSumOut.textContent = `${Math.abs(summaryOut)}€`;

  const interet = acc.movements
    //Dans la varible filte ron filtre les transaction Superieur a 0 EURO (dépot) avec la methode filter
    .filter(mov => mov > 0)
    //Dans la methode map on ajoute les Interet en fonction du compte (car tout les compte n'on pas le meme Interet)
    .map(mov => (mov * acc.interestRate) / 100)
    //On filtre les les interet supereiur a 1 Euro car seule les interet supereier a 1 euro compte
    .filter((init, i, arr) => init >= 1)
    // Ensuite on cummulle les interet qui on ete filter par la condittion précédente
    .reduce((mov, acc) => mov + acc);
  //On affiche le resutat dans la balise labelSumInteret
  labelSumInterest.textContent = `${interet}€`;
};

//Cette fonction sert a cree les Identifiant pour se connecter (les identifiant sont la premiere lettres du prenom et du nom)
const user = function (acc) {
  //On accede a la fonction avec la methode forEach avec comme paramettre 'accs' atribuer a las fonction 'user'
  acc.forEach(acc => {
    acc.username = acc.owner
      //  On creer une nouvelle variable username qui est egale a l'index owner de la methode accounts ou se trouve les prénom et nom des personnes
      .toLowerCase()
      .split(' ')
      .map(user => user[0])
      //Avec la methode map on sélectionne uniquement les lettres des deux premiers mots
      .join('');
  });
};
//On applle la fonction user
user(accounts);

//Cette fonction sert a afficher la somme totale sur la balance du compte
//cette fonction est appeller dans la fonction allCallFunction qui nous permet de factoriser notre code
const displayMovementsAll = function (acc) {
  //On cree la variable acc.balance qui est égale  a l'index 'movements' des objects 'accounts' (acc.movements)
  //On cumulle les dépot et les retrait en fonction du compte et on obtient le totale
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0); // le chiffre 0 ici est le point de depart du calcule
  //On affiche le totale dans la balise labelbalance
  labelBalance.textContent = `${acc.balance} EUR`;
};

//On cree notre variable currentAcount
let currentAccount;

//Ici on atribut un événement au bouton qui sert a valider l'identifiant et le mots de passe
btnLogin.addEventListener('click', function (e) {
  //on atribut comme paramettre a la fonction de le l'evenement 'e' qui va nous servire pour le preventDefault
  e.preventDefault();
  // le prevent default sert a annuler le comportement par default du bouton qui est de reitialiser la page

  currentAccount = accounts.find(
    /*Ici notre variable currentAccount est égale a accounts.find qui va nous servir a comparer 
    les identifiant dans le champs de saisie de l'identifiant*/
    acc => inputLoginUsername.value === acc.username
  );

  //On pose une condition directement dans la fonnctions
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    /*Ici si le la condition ecrite dans cconounts.find est correcte et que le pin coorespond
     ecrit dans le champs de saisie correspond aussi alors la consition est vraie*/
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    //Ici on affiche le site en mettant l'opacity a 100;
    containerApp.style.opacity = 100;
    //Ici on vide les champs de saisie d'Id et de mdp
    inputLoginPin.value = inputLoginUsername.value = '';

    //On appelle la fonctions allCallFunctions qui fait immediatements les differents calcule selon le compte de connection TRES IMPORTANT
    allCallFunctions(currentAccount);
    //Ici on enleve le focus le chanps de saisie du mdp
    inputLoginPin.blur();
  }
});

//Ici on attribut un évènement au boutton des transfert
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // le prevent default sert a annuler le comportement par default du bouton qui est de reitialiser la page

  const receive = accounts.find(acc => acc.username === inputTransferTo.value);
  //On cree la variable receive qui sert A DETERMINER LE COMPTE QUI VA RECEVOIR l'argent et  a voir si la personne a qui on veut envoyer existe
  const amount = Number(inputTransferAmount.value);
  //Ici on cree la variable amount qui corespond au champs de saisie de la somme a envoyer

  if (
    amount > 0 &&
    //On verifie que la somme que on veut envoyer est superieur a 0(On ne peut pas tranferer de l'argent negatif)
    currentAccount.balance >= amount &&
    //On verifie que on a l'argents disponible avec cuurent accounts
    receive?.username !== currentAccount.username
    //On verifie que la personne a qui on veut envoyer est different de nous (Il est impossible de nous envoyer l'argents a nous meme)
  ) {
    //SI LES CONDITION SONT REMPLIE ALORS:s

    currentAccount.movements.push(-amount);
    //On ajoute le montant envoyer  dans le tabelau des  mouvement des transaction du compte qui ENVOIE
    receive.movements.push(amount);
    //ON ajoute le montant envoyer dans le tabelau des  mouvement des transaction du compte qui RECOIT
    allCallFunctions(currentAccount);
    //On appelle encore la fonction pour mettre a jours la balance et l'historique des transaction
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  //On vide les champs de saisie
});

//Cette fonction sert a appller certeaine fonction en meme temps de maniere a mettre a jours le compte apres chaque operation
const allCallFunctions = function (acc) {
  //Historique
  displayMovements(acc.movements);
  //depot retrait Interet
  summaryValue(acc);
  //Balance
  displayMovementsAll(acc);
};

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(acc => acc > amount * 0.1)) {
    currentAccount.movements.push(Number(inputLoanAmount.value));
    allCallFunctions(currentAccount);
  }
  inputLoanAmount.value = '';
});

console.log(accounts.balance);
// const convertitle = function (word) {
//   const firstUpper = acc => acc[0].toUpperCase() + acc.slice(1);
//   const exepetion = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
//   const convert = word
//     .toLowerCase()
//     .split(' ')
//     .map(acc =>
//       exepetion.includes(acc) ? acc : acc[0].toUpperCase() + acc.slice(1)
//     )
//     .join(' ');
//   return firstUpper(convert);
// };
// console.log(convertitle('this is nice title'));
// console.log(convertitle('this is a LONG title but not too long'));
// console.log(convertitle('and here is another Title with an Example'));
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// // LECTURES
// const x = new Array(5);
// console.log(x);
// x.fill(5, 2, 4);
// console.log(x);

// const y = Array.from({ length: 10 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 5 }, (_, i) => i + 1);
// console.log(z);

// const w = Array.from({ length: 100 }, (_, i) =>
//   Math.trunc(Math.random(i) * 100)
// );
// console.log(w);

// labelBalance.addEventListener('click', function () {
//   const movementUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   const reduceMovement = movementUI.reduce((acc, ucr) => (acc += ucr));
//   console.log(movementUI);
// });
// let arr = new Array(5).fill(5);
// console.log(arr);
// const movementUI = [...document.querySelectorAll('.movements__value')];
// const content = movementUI.map(acc => acc.textContent);
// console.log(content);
// const contentNumber = Number(content);

// const arr = [
//   [7, [9, 2]],
//   [4, [5, 8]],
//   [3, [7, 1]],
// ];

// console.log(arr.flat(2));

// const calcmovements = accounts.map(acc => acc.movements);
// console.log(calcmovements);
// const flatmovements = calcmovements.flat();
// console.log(flatmovements);
// const reduceMovements = flatmovements.reduce((acc, arr) => (acc += arr));
// console.log(reduceMovements);

// const calcMovements = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, ucr) => (acc += ucr), 0);
// console.log(calcMovements);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const movement = movements.find(mov => mov < 0);
// console.log(movement);

// const account = accounts.find(user => user.owner === 'Steven Thomas Williams');
// console.log(account);

// for (const account of accounts) account.owner === 'Steven Thomas Williams';
// console.log(account);
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((user, acc, i, arr) => user + acc / arr.length, 0);

// const avg1 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// const avg2 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// console.log(avg1, avg2);

// const euroToUsd = 1.1;
// const loop = movements
//   .filter(arr => arr > 0)
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * euroToUsd;
//   })
//   .reduce((mov, acc) => (mov += acc), 0);
// console.log(loop);
// const calcAverageHumanAge = function (allDogsAge) {
//   const age = allDogsAge.map((ageD, i) =>
//     ageD <= 2 ? ageD * 2 : 16 + ageD * 4
//   );
//   console.log(age);
//   const ageAdult = age.filter(age => age >= 18);
//   console.log(ageAdult);

//   const moyenneAge = ageAdult.reduce(
//     (moy, acc) => moy + acc / ageAdult.length,
//     0
//   );
//   return moyenneAge;
// };

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);
// const min = movements.reduce((acc, mov) => {
//   if (acc < mov) return acc;
//   else return mov;
// });
// console.log(min);

// const moyenne = movements.reduce((acc, mov) => (acc += mov));
// console.log(moyenne / movements.length);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposit = movements.filter(mov => mov > 0);
// console.log(deposit);
// const wiltdraw = movements.filter(mov => mov < 0);
// console.log(wiltdraw);
// const eurtoUsd = 1.1;
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const conversMoney = movements.map(mov => mov * eurtoUsd);
// console.log(conversMoney);
// const movementMoney = movements.map((mov, i) => {
//   return `Transaction:${i + 1} Vous avez ${
//     mov > 0 ? 'Crédité' : 'Débité'
//   } de ${Math.abs(mov)}`;
// });
// console.log(movementMoney);

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrect = dogsJulia.slice();
//   console.log(dogsJuliaCorrect);
//   const newArray = [...dogsJuliaCorrect].slice(1, -2);
//   console.log(newArray);
//   const allDogs = dogsKate.concat(newArray);
//   allDogs.forEach(function (age, index) {
//     if (age < 3) {
//       console.log(`le chien ${index + 1} est un chiot`);
//     } else {
//       console.log(`le chient ${index + 1} est un adulte`);
//     }
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 3]);

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (values, index) {
//   console.log(`${index}: ${values}`);
// });

// const arr = new Set(['EUR', 'EUR', 'USD', 'USD', 'GPB', 'GPB']);

// arr.forEach(function (values, index) {
//   console.log('value');
// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(`---------Méthode loop-----`);
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(
//       `Transaction:${i + 1} Vous avez Déposez un montant de ${movement}$`
//     );
//   } else {
//     console.log(
//       `transcation:${i + 1} Vous avez Retirer un montant de ${movement}$`
//     );
//   }
// }
// console.log(`--------Méthode for EACH------`);

// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     console.log(
//       `Transaction:${i + 1}/${
//         arr.length
//       } Vous avez Déposez un montant de ${movement}$ `
//     );
//   } else {
//     console.log(
//       `Transaction:${i + 1} Vous avez Retirer un montant de ${movement}$`
//     );
//   }
// });

// /////////////////////////////////////////////////

// let arr = ['a', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

// //------SLICE

// console.log(arr.slice(2));
// console.log(arr.slice(5));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -5));
// console.log(arr); //la methode slice n'affecte pas le tableau d'origine

// //-------SPLICE

// console.log(arr.splice(-1));
// console.log(arr);
// console.log(arr.splice(1, 5));
// console.log(arr);

// //--------reverse
// arr = ['a', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
// console.log(arr.reverse());

// //-----Concat
// let arr2 = [4, 8, 6, 8, 4, 2];
// console.log(arr2);
// const arr3 = arr.concat(arr2);
// console.log(arr3);

// //------Join

// console.log(arr3.join('-').toUpperCase());

// //----IndexOf

// console.log(arr.indexOf('d'));

// //---pop

// console.log(arr2.pop());

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

const recommandedFood = dogs.forEach(
  acc => (acc.recFood = acc.weight ** 0.75 * 28)
);

console.log(dogs);
//Exercice 2
const sarahDogs = dogs.find(acc => acc.owners.includes('Sarah'));
// if (sarahDogs.curFood < sarahDogs.recFood * 0.9) {
//   console.log('Votre chien ne mange pas assez');
// } else if (sarahDogs.curFood > sarahDogs.recFood * 1.1) {
//   console.log('Votre chien  mange Trop');
// }
console.log(
  `Le chien de sarah ${
    dogs.curFood > dogs.recFood ? 'mange trop' : 'ne mange pas assez'
  } `
);
//Exercice 3
// const ownersEatTooMuch = [];
// dogs.filter(acc => {
//   if (acc.curFood > acc.recFood) {
//     ownersEatTooMuch.push(acc.owners);
//   }
// });
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = [];
// dogs.filter(acc => {
//   if (acc.curFood < acc.recFood) {
//     ownersEatTooLittle.push(acc.owners);
//   }
// });
// console.log(ownersEatTooLittle);

const ownersEatTooMuch = dogs
  .filter(acc => acc.curFood > acc.recFood)
  .flatMap(acc => acc.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(acc => acc.curFood < acc.recFood)
  .flatMap(acc => acc.owners);
console.log(ownersEatTooLittle);
//Exercice 4
// const phrase = ownersEatTooMuch.flat(2);
// console.log(`${phrase[0]} & ${phrase[1]} ne mange pas assez !`);
// const phrase2 = ownersEatTooLittle.flat(2);
// console.log(`${phrase2[0]} & ${phrase2[1]} & ${phrase2[2]} mange trop !`);
console.log(`${ownersEatTooLittle.join(' and ')} ne mange pas assez !`);
console.log(`${ownersEatTooMuch.join(' and ')} mange Trop`);
console.log(dogs);
//Exercice 5
console.log(dogs.some(acc => acc.recFood === acc.curFood));
// Exercie 6
const foodgood = dogs.some(
  acc => acc.curFood > acc.recFood * 0.9 && acc.curFood < acc.recFood * 1.1
);
console.log(foodgood);
//Exercice 7
const foodgood2 = dogs.filter(
  acc => acc.curFood > acc.recFood * 0.9 && acc.curFood < acc.recFood * 1.1
);
console.log(foodgood);
//Exercice 8
const dogscopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogscopy);
