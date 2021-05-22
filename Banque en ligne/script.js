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
  owner: 'Loic Pelap',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Ricardo Pelap',
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

const summaryValue = function (acc) {


  //summaryIn est egale a l'index 'movements' des objects 'accounts'
  const summaryIn = acc.movements
   
    .filter(mov => mov > 0, 0)
    //On utilise la methode reduce pour additioner les transaction supereieur a 0 EURO
    .reduce((mov, acc) => mov + acc);
  //On affiche le resultat en fonction du compte dans la balise labelSumIn en fonction du compte connecter
  labelSumIn.textContent = `${summaryIn}€`;

  //summaryOut est egale a l'index 'movements' des objects 'accounts'
  const summaryOut = acc.movements
    
    .filter(mov => mov < 0, 0)
   
    .reduce((mov, acc) => mov + acc, 0);

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


let currentAccount;

btnLogin.addEventListener('click', function (e) {

  e.preventDefault();


  currentAccount = accounts.find(

    acc => inputLoginUsername.value === acc.username
  );

  //On pose une condition directement dans la fonnctions
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
   
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
  
    containerApp.style.opacity = 100;
    //Ici on vide les champs de saisie d'Id et de mdp
    inputLoginPin.value = inputLoginUsername.value = '';

    //On appelle la fonctions allCallFunctions qui fait immediatements les differents calcule selon le compte de connection TRES IMPORTANT
    allCallFunctions(currentAccount);
    //Ici on enleve le focus le chanps de saisie du mdp
    inputLoginPin.blur();
  }
});


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  

  const receive = accounts.find(acc => acc.username === inputTransferTo.value);

  const amount = Number(inputTransferAmount.value);
  //Ici on cree la variable amount qui corespond au champs de saisie de la somme a envoyer

  if (
    amount > 0 &&
    //On verifie que la somme que on veut envoyer est superieur a 0(On ne peut pas tranferer de l'argent negatif)
    currentAccount.balance >= amount &&
    
    receive?.username !== currentAccount.username
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

