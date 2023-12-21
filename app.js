let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let ListCartHTML = document.querySelector('.ListCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let listProduct = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProduct.length > 0) {
        listProduct.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('menu');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <div class="image" onclick="animateImage(${product.id})">
                    <img src="${product.image}" alt="${product.name}" class="product-image" id="image-${product.id}">
                </div>
                <h2>${product.name}</h2>
                <div class="price">${product.price}</div>
                <button class="addCart" onclick="addToCart(${product.id})">
                    장바구니
                </button>
            `;
            listProductHTML.appendChild(newProduct);
        })
    }
}

// 특정 이미지에 애니메이션 효과 주는 함수
const animateImage = (productId) => {
    let image = document.getElementById(`${productId}`);
    if (image) {
        image.classList.add('animate');
        setTimeout(() => {
            image.classList.remove('animate');
        }, 1000); // 애니메이션 지속 시간 (1초)
    }
}


let productCounter = 0; // 증가하는 product_id를 추적하기 위한 카운터

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let product = positionClick.parentElement.dataset.id;
        addToCart(product);
        updateProductCounter();
        animateCartIcon();
    }
})

const updateProductCounter = () => {
    productCounter = carts.reduce((total, cart) => total + cart.quantity, 0);
    document.getElementById('product_id').textContent = productCounter;

    // 아이콘 크기 감소 애니메이션
    animateCartIcon();
}

const animateCartIcon = () => {
    let cartIcon = document.querySelector('.fa-cart-shopping');
    cartIcon.classList.add('animate'); // 애니메이션 클래스 추가

    // 애니메이션이 끝난 후에 클래스 제거
    cartIcon.addEventListener('animationend', () => {
        cartIcon.classList.remove('animate');
    });
}



const updateQuantity = (cartIndex, action) => {
    if (action === 'decrease') {
        if (carts[cartIndex].quantity > 1) {
            carts[cartIndex].quantity -= 1;
        } else {
            // 수량이 1일 때 감소하면 해당 제품을 장바구니에서 삭제
            carts.splice(cartIndex, 1);
        }
        updateProductCounter(); // 수량이 변경될 때 장바구니 아이콘 갯수 업데이트
    } else if (action === 'increase') {
        carts[cartIndex].quantity += 1;
        updateProductCounter(); // 수량이 변경될 때 장바구니 아이콘 갯수 업데이트
    }
    addCartToHTML();
}



const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);

    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        // 해당 제품이 이미 장바구니에 있는 경우 수량만 늘림
        let currentQuantity = parseInt(carts[positionThisProductInCart].quantity);
        carts[positionThisProductInCart].quantity = currentQuantity;
    }

    addCartToHTML();
    saveCurrentCartState(); // 현재 카트 상태를 저장
}

function saveCurrentCartState() {
    // 현재 카트 상태를 localStorage에 저장합니다.
    localStorage.setItem('previousCartState', JSON.stringify(carts));
}








const addCartToHTML = () => {
    ListCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach((cart, index) => {
            let newCart = document.createElement('div');
            newCart.classList.add('menu');
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            let info = listProduct[positionProduct];

            // 3자리마다 쉼표를 찍는 함수
            const formatNumber = (num) => {
                return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            newCart.innerHTML = `
                <div class="menu">
                    <div class="image">
                        <img src="${info.image}" alt="">
                    </div>
                    <div class="name">
                        ${info.name}
                    </div>
                    <div class="totalPrice">
                        ${formatNumber(info.price * cart.quantity)}
                    </div>
                    <div class="quantity">
                        <span class="minus" onclick="updateQuantity(${index}, 'decrease')">
                            <i class="fa-solid fa-minus"></i>
                        </span>
                        <span>${cart.quantity}</span>
                        <span class="minus" onclick="updateQuantity(${index}, 'increase')">
                            <i class="fa-solid fa-plus"></i>
                        </span>
                    </div>
                </div>`;
            ListCartHTML.appendChild(newCart);
        })
    }
}

// app.js
document.addEventListener('DOMContentLoaded', function () {
    initApp();
});

const initApp = () => {
    fetch('product.json')
    .then(Response => Response.json())
    .then(data => {
        listProduct = data;
        addDataToHTML();

        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })

    const orderButton = document.querySelector('.Order');
    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    const closeButton = document.querySelector('.close-button');
    const cancelButton = document.querySelector('.cancel-button');
    const paymentButton = document.querySelector('.payment-button');
    const noOrderModal = document.querySelector('.no-order-modal');
    const noOrderCloseButton = document.querySelector('.no-order-close-button');
    const receiptModal = document.querySelector('.receipt-modal');
    const printButton = document.querySelector('.print-button');
    const noPrintButton = document.querySelector('.no-print-button');

    noPrintButton.addEventListener('click', () => {
        window.location.href = 'index.html?'
    });

// 영수증 모달을 숨기는 함수
function hideReceiptModal() {
    const receiptModal = document.querySelector('.receipt-modal');
    receiptModal.style.display = 'none';
}


    orderButton.addEventListener('click', () => {
        if (carts.length > 0) {
            showModal();
        } else {
            showNoOrderModal();
        }
    });
    
    closeButton.addEventListener('click', () => {
        hideModal();
    });

    cancelButton.addEventListener('click', () => {
        // 취소 버튼 클릭 시 현재 창에서 index.html로 이동
        window.location.href = 'index.html?';
    });

    paymentButton.addEventListener('click', () => {
        // 여기에 결제 로직을 추가하세요.
        alert('결제가 완료되었습니다.');
        // 결제 후 초기화 또는 다른 작업을 수행할 수 있습니다.
        resetCart();
        hideModal();
    });

    noPrintButton.addEventListener('click', () => {
        hideReceiptModal();
    });

    



    function showNoOrderModal() {
        noOrderModal.style.display = 'block';

        // 추가된 부분: 주문이 없을 때 닫기 버튼에 대한 이벤트 리스너
        noOrderCloseButton.addEventListener('click', () => {
            hideNoOrderModal();
        });
    }

    // 추가된 부분: 주문이 없을 때 모달을 숨기는 함수
    function hideNoOrderModal() {
        noOrderModal.style.display = 'none';
    }

    function showReceiptModal() {
        receiptModal.style.display = 'block';
    
        // 추가된 부분: 주문 내용을 표시하는 함수 호출
        showOrderDetails();
    
        // 추가된 부분: 프린트 버튼에 대한 이벤트 리스너
        printButton.addEventListener('click', () => {
            // 여기에 프린트하는 로직을 추가하세요.
            printReceipt();
            hideReceiptModal();
        });
    
        // 추가된 부분: 아니요 버튼에 대한 이벤트 리스너
        noPrintButton.addEventListener('click', () => {
            hideReceiptModal();
        });
    }
    
    
    let orderCount = 0; // 대기번호를 저장할 변수

    // 대기번호를 생성하는 함수
    function generateOrderNumber() {
        const min = 1;
        const max = 45;
        const randomNum = (Math.random() * max - min) + min;
        const orderNumber = Math.ceil(randomNum);
        return orderNumber;
    }
    
    // 추가된 부분: 주문 내용을 표시하는 함수
    function showOrderDetails() {
        const orderDetailsContainer = document.getElementById('order-details');
        const totalAmountElement = document.getElementById('total-amount');
        const orderNumberElement = document.getElementById('order-number');
    
        // 주문 내용 초기화
        orderDetailsContainer.innerHTML = '';
    
        // 주문 내용을 표시
        carts.forEach(cart => {
            let positionProduct = listProduct.findIndex(value => value.id == cart.product_id);
            let info = listProduct[positionProduct];
    
            const orderDetail = document.createElement('p');
            orderDetail.textContent = `${info.name} - 수량: ${cart.quantity} - 금액: ${formatNumber(info.price * cart.quantity)}`;
            orderDetailsContainer.appendChild(orderDetail);
        });
    
        // 총 금액 표시
        totalAmountElement.textContent = formatNumber(calculateTotalPrice());
    
        // 대기번호 표시
        const orderNumber = generateOrderNumber();
        orderNumberElement.textContent = orderNumber;
    }
    
    // 주문을 완료하고 대기번호를 생성하여 표시하는 예시
    function completeOrder() {
        // 주문 완료 로직
        // ...
    
        // 대기번호를 생성하여 표시
        showOrderDetails();
    }
    
    // 대기번호 초기화
    function resetOrderCount() {
        orderCount = 0;
    }
    
    
    
    
    
    

    // 추가된 부분: 영수증 모달을 숨기는 함수
    function hideReceiptModal() {
        receiptModal.style.display = 'none';

        // 추가된 부분: 이벤트 리스너 제거
        printButton.removeEventListener('click', () => {});
        noPrintButton.removeEventListener('click', () => {});
    }
    
    function showModal() {
        modal.style.display = 'block';
        modalContent.innerHTML = `
            <h2>총 금액: ${formatNumber(calculateTotalPrice())}</h2>
            <button class="payment-button">결제</button>
            <button class="cancel-button">취소</button>
        `;
    
        // 추가된 부분: 결제 버튼에 대한 이벤트 리스너
        const paymentButtonInModal = document.querySelector('.payment-button');
        paymentButtonInModal.addEventListener('click', () => {
            setTimeout(() => {
                showReceiptModal();
                hideModalAndPaymentButton();  // 결제가 완료되면 모달과 결제 버튼을 숨깁니다.
            }, 1000);
        });
    
        // 추가된 부분: cancelButton에 대한 이벤트 리스너 추가
        const cancelButtonInModal = document.querySelector('.cancel-button');
        cancelButtonInModal.addEventListener('click', () => {
            // 취소 버튼 클릭 시 현재 창에서 index.html로 이동
            window.location.href = 'index.html?';
        });
    }
    
    function hideModalAndPaymentButton() {
        modal.style.display = 'none';
        // 결제 버튼을 숨깁니다.
        const paymentButtonInModal = document.querySelector('.payment-button');
        paymentButtonInModal.style.display = 'none';
    }
    
    
    function restoreCartState() {
        // 이전 상태를 localStorage에서 불러옵니다.
        const previousCartState = JSON.parse(localStorage.getItem('previousCartState'));
    
        if (previousCartState) {
            // 이전 상태가 존재하면 현재 카트를 이전 상태로 업데이트합니다.
            carts = previousCartState;
            addCartToHTML(); // 변경된 카트를 화면에 반영합니다.
        }
    }
    

function calculateTotalPrice() {
    let totalPrice = 0;
    carts.forEach(cart => {
        let positionProduct = listProduct.findIndex(value => value.id == cart.product_id);
        let info = listProduct[positionProduct];
        totalPrice += info.price * cart.quantity;
    });
    return totalPrice;
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

}


initApp();

