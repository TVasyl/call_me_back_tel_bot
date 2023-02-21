"use strict"

const form = document.querySelector('.form');
const nameSelector = document.getElementById('userName');
const telSelector = document.getElementById('userPhone');
const checkSelector = document.getElementById('exampleCheck1');
const checkErrorSelector = document.querySelector('.check-error');


const inputMask = new Inputmask('+38 (999) 999-99-99');
inputMask.mask(telSelector);

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let userName = this.userName.value;
    let userPhone = telSelector.inputmask.unmaskedvalue();
    let userCheck = checkSelector.checked;
    userName = userName.trim();
    
    const isValide = userDataValidate(userName, userPhone, userCheck);

    if (isValide) sendMessage(userName, userPhone);
});

/**
 * Method for validation of user data
 * @param {string} name - user name from Form
 * @param {number} phone - user phone from Form
 * @param {boolean} checcked - is user checked in Fomr
 * @returns {boolean}
 */
function userDataValidate(name, phone, checcked) {
    
    // check validation
    if (!checcked) {
        checkErrorSelector.style.visibility = "visible";
    } 
    else {
        checkErrorSelector.style.visibility = "hidden";
    }
    // name validation
    if (!name || name < 3) {
        nameSelector.classList.add('valid-error');
        name =  false;
    } else {
        nameSelector.classList.remove('valid-error');
        name =  true;
    }

    // phone validation 
    if (!phone || phone.length < 10) {
        telSelector.classList.add('valid-error');
        phone =  false;
    } else {
        telSelector.classList.remove('valid-error');
        phone =  true;
    }

    return name && phone && checcked;
}

/**
 * Method for send message to Telegram Bot with AXIOS 
 * @param {string} userName 
 * @param {number} userPhone 
 */
function sendMessage(userName, userPhone) {
    fetch("http://localhost:3500", {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({'userName': userName, 'userPhone': userPhone})
    })
    .then((res) => res.json())
    .then(data => {
        console.log(data);
        if (data.ok) {
            appComplited()
        } else {
            appFail(data.error_code);
            console.log("Error from Telegram: " + data.description);
        };
    })
}

/**
 * Method which show application completed
 */
function appComplited() {
    document.querySelector('.contant__text').innerHTML = 'Вашу заявку виконано, невдовзі наш працівник Вам зателефонує!';
}

/**
 * Method which show application fail
 */
function appFail(errorCode) {
    document.querySelector('.contant__text').innerHTML = `Вибачте, щось пішло не так, Вашу заявку відхилено ${errorCode}`;
}
