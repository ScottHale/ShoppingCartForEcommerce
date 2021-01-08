class Cart{

  constructor(){
    this.cart=this._getCart();
    this.currency_format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    this.cartTotal;
  }

  _getCart = () => {
    return this.cart = localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")):{};
  }

  removeItem = (item_key) => {
    this.cart = this._getCart();
    delete this.cart[item_key];
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  addItem = (item_id, item_size, item_qty, item_cost) => {
    this.cart = this._getCart();
    if(this.cart[item_id+"_"+item_size]){
      this.updateItem(item_id+"_"+item_size, item_qty);
    }
    else{    
      this.cart[item_id+"_"+item_size] = {id:item_id, size:item_size, qty: Number(item_qty), cost: Number(item_cost)};
      localStorage.setItem("cart", JSON.stringify(this.cart));
    }
  }

  updateItem = (item_key, item_qty) => {
    this.cart = this._getCart();
    this.cart[item_key].qty = Number(this.cart[item_key].qty) + Number(item_qty);
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  _removeChildNodes = (container) =>{
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
  }

  getCartContents = (container) =>{
    this.cartTotal = 0;
    if(container.hasChildNodes()){
      this._removeChildNodes(container);
    }

    let header_row = document.createElement('div');
    header_row.classList.add("cart-header-row");

    let header_item_name = document.createElement('div');
    header_item_name.classList.add("cart-header-name");
    header_item_name.innerHTML = "Item Name";
    header_row.append(header_item_name);

    let header_item_size = document.createElement('div');
    header_item_size.classList.add("cart-header-size");
    header_item_size.innerHTML = "Item Size"
    header_row.append(header_item_size);

    let header_item_qty = document.createElement('div');
    header_item_qty.classList.add("cart-header-qty");
    header_item_qty.innerHTML = "Quantity"
    header_row.append(header_item_qty);

    let header_item_cost = document.createElement('div');
    header_item_cost.classList.add("cart-header-cost");
    header_item_cost.innerHTML = "Cost"
    header_row.append(header_item_cost);

    let header_item_remove = document.createElement('div');
    header_item_remove.classList.add("cart-header-remove");
    header_row.append(header_item_remove);

    container.append(header_row);
    container.append(document.createElement('hr'));

    this.cart = this._getCart();
    let keys = Object.keys(this.cart);
    
    keys.map((key)=>{
      let item_row = document.createElement('div');
      item_row.classList.add("cart-item-row");

      let item_name = document.createElement('div');
      item_name.classList.add("cart-item-name");
      item_name.innerHTML = this.cart[key].id;
      item_row.append(item_name);

      let item_size = document.createElement('div');
      item_size.classList.add("cart-item-size");
      item_size.innerHTML = this.cart[key].size;
      item_row.append(item_size);

      let item_qty = document.createElement('div');
      item_qty.classList.add("cart-item-qty");
      item_qty.innerHTML = this.cart[key].qty;
      item_row.append(item_qty);

      let item_cost = document.createElement('div');
      item_cost.classList.add("cart-item-cost");
      item_cost.innerHTML = this._getTotalItemCost(this.cart[key]);
      item_row.append(item_cost);

      let item_remove = document.createElement('div');
      item_remove.classList.add("cart-item-remove");

      let item_remove_link = document.createElement('a');
      item_remove_link.href = "javascript:window.removeFromCart('" + this.cart[key].id +"_"+this.cart[key].size +"')";
      item_remove_link.innerHTML = "x";
      item_remove.append(item_remove_link);

      item_row.append(item_remove);

      container.append(item_row);
    });

    if(keys.length==0){
      let no_item_row = document.createElement('div');
      no_item_row.classList.add("no-items-row");
      no_item_row.innerHTML = "No items in cart."
      container.append(no_item_row);
    }

    container.append(document.createElement('hr'));

    let total_row = document.createElement('div');
    total_row.classList.add("cart-total-row");

    let total_remove = document.createElement('div');
    total_remove.classList.add("cart-item-remove");
    total_row.append(total_remove);

    let total_cost = document.createElement('div');
    total_cost.classList.add("cart-item-cost");
    total_cost.innerHTML = this.currency_format.format(this.cartTotal);
    total_row.append(total_cost);

    container.append(total_row);
  }

  _getTotalItemCost = (item) => {
    let cost = Number(item.qty) * Number(item.cost);
    this.cartTotal += cost;
    return this.currency_format.format(cost);
  }

  getCartItemsCount = () =>{
    let item_count = 0;
    this.cart = this._getCart();
    let keys = Object.keys(this.cart);
    keys.map((key)=>{
      item_count = item_count + Number(this.cart[key].qty);
    });
    return item_count;
  }

}

if(!window.cart){
  window.cart = new Cart();

  window.addToCart = () => {
    var form = document.forms[0];
    // need to transform from form to js here
    var item_size = form.size?form.size.value:"One Size Fits All";
    var item_cost = form.price.value.replace("$","");
    window.cart.addItem(form.name.value, item_size, form.quantity.value, item_cost);
    let container = document.getElementById("cart-container");
    if(container && container.style.display === "block"){
      window.showCart();
    }
  }

  window.removeFromCart = (item_id) =>{
    delete window.cart.removeItem(item_id);
    window.showCart();
  }

  window.showCart = () =>{
     let container = document.getElementById("cart-container");
     window.cart.getCartContents(container);
     container.style.display = "block";
  }

  window.hideCart = () =>{
    let container = document.getElementById("cart-container");
    container.style.display = "none";
  }

  window.getItemsCount = () =>{
    window.cart.getCartItemsCount();
  }  
}
