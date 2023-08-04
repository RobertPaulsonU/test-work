//Variables====================================================================
const cart = document.querySelector('.header__actions-dropdown')
let prices = []
let quantities = []
let allCardsStr = []
let cardsStr = {}

//Listeners====================================================================
window.onload = function () {
    document.addEventListener('click', documentActions);
    getItemsFromLocalStorage()
    calcPrices()
    setAllElemsOnload()
}
//Functions====================================================================
//Click events
function documentActions(e) {
    const targetElement = e.target;
    if (targetElement.classList.contains('cart-icon') || targetElement.closest('.cart-icon')) {
        e.preventDefault()
        cart.classList.toggle('_active')
    }
    if (targetElement.classList.contains('shop-btn')) {
        const productId = targetElement.closest('.item-catalog').dataset.pid;
        e.preventDefault();
        addToCart(productId);
        checkCardItems()
        calcPrices()
        setItemsToLocalStorage()
    }
    if (targetElement.classList.contains('reset-link')) {
        e.preventDefault()
        deleteAllCartItems()
        localStorage.removeItem('cards')
        targetElement.style.display = 'none'
    }
    if (targetElement.classList.contains('cart-list__delete')) {
        const productId = targetElement.closest('.list-actions__item').dataset.cartPid;
        e.preventDefault()
        addToCart(productId, false)
        calcPrices()
        setItemsToLocalStorage()
    }
}
//Generate items at cart dropdown
function addToCart(productId, productAdd = true) {
    const cartIcon = document.querySelector('.cart-icon');
    const cartQuantity = cartIcon.querySelector('span');
    const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
    const cartList = document.querySelector('.list-actions');
    //Add
    if (productAdd) {
        if (cartQuantity){
            cartQuantity.innerHTML = ++cartQuantity.innerHTML;
        } else {
            cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
        }
        if (!cartProduct) {
            const product = document.querySelector(`[data-pid="${productId}"]`)
            const cartProductImage = product.querySelector('.item-catalog__image').innerHTML;
            const cartProductTitle = product.querySelector('.item-catalog__title').innerHTML;
            const cartProductPrice = product.querySelector('.item-catalog__price').innerHTML; 
            const cartProductContent = 
            `
            <a href="#" class="list-actions__image">${cartProductImage}</a>
            <div class="list-actions__body">
            <a class="list-actions__title" href"#">${cartProductTitle}</a>
            <div class="list-actions__price">${cartProductPrice}</div>
            <div class="list-actions__quantity">Кількість: <span>1</span></div>
            <a class="cart-list__delete" href="#">Видалити</a>
            </div>
            `;
            cartList.insertAdjacentHTML('beforeend',`<li data-cart-pid="${productId}" class="list-actions__item">${cartProductContent}</li>`)
        } else {
            const cartProductQuantity = cartProduct.querySelector('.list-actions__quantity span');
            cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML; 
        }
    } else {
        //Remove
        const cartProductQuantity = cartProduct.querySelector('.list-actions__quantity span');
        cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
        if (!parseInt(cartProductQuantity.innerHTML)) {
            cartProduct.remove();
        }
        const cartQuantityValue = --cartQuantity.innerHTML;
        if (cartQuantityValue) {
            cartQuantity.innerHTML = cartQuantityValue;
        } else {
            cartQuantity.remove()
            document.querySelector('.reset-link').style.display = 'none'
            removeResaultSumm()
        }
    }
}
//
function checkCardItems() {
    const cartItems = cart.querySelectorAll('.cart-list__item')
    const deleteBtn = document.querySelector('.reset-link')
    if (cartItems) {
        deleteBtn.style.display = 'block'
    } else {
        deleteBtn.style.display = 'none'
    }
}
//Delete all elems in dropdown
function deleteAllCartItems() {
    const cartItems = cart.querySelectorAll('.list-actions__item')
    mainQuantity = document.querySelector('.cart-icon span')
    cartItems.forEach(item => item.remove())
    mainQuantity.remove()
    removeResaultSumm()
}
//Calculate summ of prices and quantity
function calcPrices() {
    prices = []
    quantities = []
    const items = document.querySelectorAll('.list-actions__item')
    items.forEach(item => getValues(item))
    const resultQuntities = sumArrayElements(quantities);
    const resultPrices = sumArrayElements(prices);
    insertResault(resultPrices, resultQuntities)
}
function getValues(item) {
    const itemQuantity = item.querySelector('.list-actions__quantity span').innerHTML
    const itemPrice = item.querySelector('.list-actions__price').innerHTML;
    const itemPriceNum = parseInt(itemPrice.replace(/[^0-9]+/g, '')) 
    const itemQuantityNum = parseInt(itemQuantity)
    let itemFullPrice = itemQuantityNum * itemPriceNum
    prices.push(itemFullPrice)
    quantities.push(itemQuantityNum)
}
function sumArrayElements(arr) {
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}
function insertResault(price, quantity) {
    if (quantity > 0) {
        const resault = document.querySelector('.header__actions-info')
        resault.innerHTML = `Кількість : ${quantity} (${price}$)`
    } else {
        removeResaultSumm()
    }
}
//Set standart values
function removeResaultSumm() {
    const resault = document.querySelector('.header__actions-info')
    resault.innerHTML = 'Кошик пустий (0 грн)'
}
//Add cards to Local Srorage
function setItemsToLocalStorage() {
    cardsStr = {}
    localStorage.removeItem('cards')
    const allCards = document.querySelectorAll('.list-actions__item')
    allCards.forEach(card => {
        let cardText = card.innerHTML
        let cardId = card.dataset.cartPid   
        cardsStr[cardId] = cardText
    })
    localStorage.setItem('cards', JSON.stringify(cardsStr))
}
//Get cards from local Storage
function getItemsFromLocalStorage() {
    const cards = JSON.parse(localStorage.getItem('cards'))
    for (const key in cards) {
        let cartProductContent = cards[key]
        generateItemsFromStorage(key, cartProductContent)
    }
}
//Generate cards from Local Storage
function generateItemsFromStorage(productId, cartProductContent) {
    const cartList = document.querySelector('.list-actions');
    cartList.insertAdjacentHTML('beforeend',`<li data-cart-pid="${productId}" class="list-actions__item">${cartProductContent}</li>`)
}
//Set all needed check items
function setAllElemsOnload() {
    const quantity = sumArrayElements(quantities)
    if (quantity > 0) {
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.insertAdjacentHTML('beforeend', `<span>${quantity}</span>`)
        document.querySelector('.reset-link').style.display = 'block'
    }
}