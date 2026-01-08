class DishNotFoundError extends Error{
    constructor(m){
        super(m)
        this.name = "Dish Not Found Error"
    }
}
class InvalidOrderError extends Error{
    constructor(m){
        super(m)
        this.name = "Invalid Order Error"
    }
}
class Menu{
    #dishes = []
    constructor(){
        if(new.target === Menu){
            throw new Error("Cannot instantiate abstract class")
        }
    }
    addDish(dish){
        throw new Error("dish() must be implemented in subclass")
    }
    removeDish(dishName){
        throw new Error("removeDish() must be implemented in subclass")
    }
    viewMenu(){
        throw new Error("viewMneu() must be implemented in subclass")
    }
    get dishes(){
        return this.#dishes
    }
    set dishes(value){
        if(this.#dishes.length === 0){
            throw new Error("Dishes cant be empty")
        }
        this.#dishes = value
    }
    increasePrice(dishName, percent){
        let dish = this.dishes.find(d => d.name === dishName)
        if(!dish){
            throw new DishNotFoundError(dishName)
        }
        dish.price *= 1 + percent / 100
    }
    decreasePrice(dishName, percent) {
        let dish = this.dishes.find(d => d.name === dishName)
        if(!dish){
            throw new DishNotFoundError(dishName)
        }
        dish.price *= 1 - percent / 100
    }
    applyDemandPricing(popularDishNames) {
        popularDishNames.forEach(name => this.increasePrice(name, 15.5))
    }
}   

class AppetizersMenu extends Menu{
    constructor(price){
        super()
        this.price = price
    }
    addDish(dish){
        if (this.dishes.find(d => d.name === dish.name)) {
            throw new DishNotFoundError(`Dish ${dish} already have in manu`)
        }
        this.dishes.push(dish)
    }
    removeDish(dishName){
        if (!(this.dishes.find(d => d.name === dishName))) {
            throw new DishNotFoundError(`Dish ${dishName} havet in manu`)
        }
        this.dishes = this.dishes.filter(d => d.name !== dishName)
    }
    viewMenu(){
        return this.dishes
    }
}
class EntreesMenu extends Menu{
    constructor(period){
        super()
        this.period = period
    }
    addDish(dish){
        if (this.dishes.find(d => d.name === dish.name)) {
            throw new DishNotFoundError(`Dish ${dish} already have in manu`)
        }
        this.dishes.push(dish)
    }
    removeDish(dishName){
        if (!(this.dishes.find(d => d.name === dishName))) {
            throw new DishNotFoundError(`Dish ${dishName} havet in manu`)
        }
        this.dishes = this.dishes.filter(d => d.name !== dishName)
    }
    viewMenu(){
        return this.dishes
    }
}
class  DessertsMenu extends Menu{
    constructor(kilocalorie){
        super()
        this.kilocalorie = kilocalorie
    }
    addDish(dish){
        if (this.dishes.find(d => d.name === dish.name)) {
            throw new DishNotFoundError(`Dish ${dish} already have in manu`)
        }
        this.dishes.push(dish)
    }
    removeDish(dishName){
        if (!(this.dishes.find(d => d.name === dishName))) {
            throw new DishNotFoundError(`Dish ${dishName} havet in manu`)
        }
        this.dishes = this.dishes.filter(d => d.name !== dishName)
    }
    viewMenu(){
        return this.dishes
    }
}

class Customer{
    constructor(name,contactInfo){
        this.name = name
        this.contactInfo = contactInfo
        this.orderHistory = []
    }
    placeOrder(order){
        if(!(order instanceof Order)){
            throw new InvalidOrderError("“Invalid order”")
        }
        this.orderHistory.push(order)
    }
    viewOrderHistory(){
        return this.orderHistory
    }
    get name(){
        return this._name
    }
    set name(value){
        if(typeof value !== "string" || value.length === 0){
            throw new Error("Name must be non-empty string")
        }
        this._name = value
    }
    get contactInfo(){
        return this._contactInfo
    }
    set contactInfo(value){
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(value)) {
            throw new Error("Invalid Email address")
        }
        this._contactInfo = value
    }
}
class Order{
    #totalPrice = 0
    constructor(customer){
        this.customer = customer
        this.dishes = []
    }
    addDish(dishName, menus) {
        if(!menus.dishes.find(n => n.name === dishName.name)) {
            throw new DishNotFoundError("`Dish ${dishName} havnt in manu`")
        }
        this.dishes.push(dishName)
        this.totalPrice += dishName.price
    }
    getTotal(){
        return this.totalPrice
    }
    viewSummary(){
        console.log(`customer ${this.customer.name}`)
        console.log(`dishes ${this.dishes.map(d => d.name)}`)
        console.log(`total price ${this.totalPrice}`)
    }
    get totalPrice(){
        return this.#totalPrice
    }
    set totalPrice(value){
        if(value < 0){
            throw new Error("price must be positive")
        }
        this.#totalPrice = value
    }
}
class Dish{
    constructor(name,price){
        this.name = name
        this.price = price
    }
    get name(){
        return this._name
    }
    set name(value){
        if(typeof value !== "string" || value.length === 0){
            throw new Error("name must be non-empty string")
        }
        this._name = value
    }
    get price(){
        return this._price
    }
    set price(value){
        if(value < 0){
            throw new Error("price must be positive")
        }
        this._price = value
    }
}
class Appetizer extends Dish{
    constructor(name,price){
        super(name,price)
    }
}
class Entree extends Dish{
    constructor(name,price){
        super(name,price)
    }
} 
class Dessert extends Dish{
    constructor(name,price){
        super(name,price)
    }
}

const appetizersMenu = new AppetizersMenu()
const salad = new Appetizer("Salat", 18)
appetizersMenu.addDish(salad)
const ani = new Customer("Ani", "ani@example.com")
const order1 = new Order(ani)
order1.addDish(salad, appetizersMenu)
order1.viewSummary()
