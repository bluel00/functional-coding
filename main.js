// 테스트 하기 쉽게 만들기
// 1. DOM 업데이트와 비즈니스 규칙은 분리되어야 합니다.
// 2. 전역변수가 없어야 합니다.

// 재사용하기 쉽게 만들기
// 1. 전역변수에 의존하지 않아야 합니다.
// 2. DOM을 사용할 수 있는 곳에서 실행된다고 가정하면 안됩니다.
// 3. 함수가 결괏값을 리턴해야 합니다.

// 액션에서 계산 빼내기

let shippingCart = []; // 액션 변경 가능한 전역변수
let shippingCartTotal = 0; // 액션 변경 가능한 전역변수

// 액션
function addItemToCart(name, price) {
  shippingCart = addItem(shippingCart, name, price); // 전역변수 수정 액션

  calcCartTotal();
}

// 액션
function calcCartTotal() {
  shippingCartTotal = calcTotal(shippingCart); // 전역변수 수정 액션

  setCartTotalDom();

  updateShippingIcons();

  updateTaxDom();
}

// 액션
function updateShippingIcons() {
  let buyButtons = getBuyButtonsDom(); // 액션 DOM에서 읽어옴

  for (const button of buyButtons) {
    let item = button.item;

    if (isFreeShipping(item.price, shippingCartTotal)) {
      button.showFreeShippingIcon(); // 액션 DOM 변경
    } else {
      button.hideFreeShippingIcon();
    }
  }
}

// 액션
function updateTaxDom() {
  setTaxDom(calcTax(shippingCartTotal));
}

// 계산
function addItem(cart, name, price) {
  return [...cart, { name, price }];
}

// 계산
function calcTotal(cart) {
  let total = 0;

  for (const item of cart) {
    total += item.price;
  }

  return total;
}

// 계산
function isFreeShipping(itemPrice, total) {
  return itemPrice + total >= 20;
}

// 계산
function calcTax(amount) {
  return amount * 0.1;
}
