class Cart {
	constructor(source, container = '.drop-cart-content') {
		this.source = source;
		this.container = container;
		this.countGoods = 0; // Общее кол-во товаров в корзине
		this.amount = 0; // Общая стоимость товаров в корзине
		this.cartItems = []; // Все товары
		this._init();
	}
	_init() {
		this._render();
		/*fetch(this.source)
		     .then(result => result.json())
		     .then(data => {
		         for (let product of data.contents){
		             this.cartItems.push(product);
		             this._renderItem(product);
		         }
		         this.countGoods = data.countGoods;
		         this.amount = data.amount;
		         this._renderSum();
		     })*/
		$.ajax({
//необходимо отправить запрос типа GET
      type: 'get',
//на указанный URL-адрес
      url: 'getCart.json',
//по возвращении данных вызвать callback-функцию
      success: alert('callback'),
//данные будут передаваться в формате JSON
      dataType: "json"
    })
	}
	_render() {
		let $cartItemsDiv = $('<div/>', {
			class: 'cart'
		});
		let $totalCost = $('<div/>', {
			class:'total-cost'
		});
		let $totalGoods = $('<span/>', {
			class: 'cart-summary sum-goods'
		});
		let $totalPrice = $('<span/>', {
			class: 'cart-summary sum-price'
		});
        $totalCost.append($($totalGoods));
		$totalCost.append($($totalPrice));
		$cartItemsDiv.appendTo($(this.container));
		$totalCost.appendTo($(this.container));
		
	}
	_renderItem(product) {
		let $container = $('<div/>', {
			class: 'cart-product',
			'data-product': product.id_product
		});
		$container.append($(`<img class="cart-product-foto" src="${product.product_src}">`));
		let $characteristic = $('<div/>', {
			class: "characteristic"
		});
		$characteristic.append($(`<div class="cart-name-product">${product.product_name}</div>`));

		$characteristic.append($(
			`<div class="stars-drop-cart">
				<div class="star"></div>
				<div class="star"></div>
				<div class="star"></div>
				<div class="star"></div>
				<div class="star"></div>
			</div>`));
		$characteristic.append($(`<div class="cost"><span class="cost product-quantity">${product.quantity}X</span><span class="cost product-price"> $ ${product.price}</span></div>`));
		$characteristic.appendTo($($container));
		let $delBtn = $(`<div class="action-button delBtn"><a href="" class="cart-action"><img src="img/shopping-cart/-_2901.png"></a></div></div>`);
		$delBtn.click(() => {
			event.preventDefault();
			this._remove(product.id_product)
		});
		$container.append($delBtn);
		$container.appendTo($('.cart'));
	}
	_renderSum() {
		$('.sum-goods').text(`TOTAL -   ${this.countGoods}`);
		$('.sum-price').text(` $ ${this.amount}`);
	}
	_updateCart(product) {
		let $container = $(`div[data-product="${product.id_product}"]`);
		$container.find('.product-quantity').text(`X ${product.quantity}`);
		$container.find('.product-price').text(`$ ${product.quantity*product.price}`);
	}
	addProduct(elem) {
		let el = $(elem).parent();
		let productId = +$(el).data('id');

		let find = this.cartItems.find(product => product.id_product === productId);
		if (find) {
			find.quantity++;
			this.countGoods++;
			this.amount += find.price;
			this._updateCart(find);
		} else {
			let product = {
				id_product: productId,
				product_name: $(el).data('name'),
				product_src: $(el).data('src'),
				price: +$(el).data('price'),
				quantity: 1
			};

			this.cartItems.push(product);
			this._renderItem(product);
			this.amount += product.price;
			this.countGoods += product.quantity;
			
		}
		$('.open-cart').before(`<div class='open-cart-num'>${this.countGoods}</div>`);
		this._renderSum();
		
	}
	_remove(id) {
		//TODO: удаление товара
		let find = this.cartItems.find(product => product.id_product === id);
		if (find.quantity > 1) {
			find.quantity--;
			this._updateCart(find);
		} else {
			this.cartItems.splice(this.cartItems.indexOf(find), 1);
			$(`div[data-product="${id}"]`).remove();

		}
		this.countGoods--;
		this.amount -= find.price;
		if (this.countGoods !== 0) {
			this._renderSum();
			$('.open-cart').before(`<div class='open-cart-num'>${this.countGoods}</div>`);
		} else {
			$(`.sum-goods`).text('');
			$('.sum-price').text(``);
			$('.open-cart-num').remove();
		}
		
	}
}
