module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = function(item, item_id) {
		var storedItem = this.items[item_id];
		if(!storedItem)
		{
			storedItem = this.items[item_id] = {item: item, qty: 0, price: 0};
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.item.price;
	};

	this.reduceByOne = function(item_id) {
		this.items[item_id].qty--;
		this.items[item_id].price -= this.items[item_id].item.price;
		this.totalQty--;
		this.totalPrice -= this.items[item_id].item.price;

		if(this.items[item_id].qty <= 0)
		{
			delete this.items[item_id];
		}
	};

	this.remove = function(item_id) {
		this.totalQty -= this.items[item_id].qty;
		this.totalPrice -= this.items[item_id].price;
		delete this.items[item_id];
	};

	this.generateArray = function() {
		var products = [];
		for(var id in this.items)
		{
			products.push(this.items[id]);
		}
		return products;
	};
};