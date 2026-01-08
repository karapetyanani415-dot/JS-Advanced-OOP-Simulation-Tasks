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
        let dish = this.dishes(dishName)
        dish.price *= 1 + percent / 100
    }
    decreasePrice(dishName, percent) {
        let dish = this.#dishes.get(dishName)
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
        if (this.dishes.hasOwnProperty(dish) || (typeof dish !== "string" || dish.length === 0)) {
            throw new Error(`Dish ${dish} already have in manu`)
        }
        this.dishes[dish] = new Appetizer(dish, this.price)
    }
    removeDish(dishName){
        if (!(this.dishes.hasOwnProperty(dishName))) {
            throw new DishNotFoundError(`Dish ${dishName} havet in manu`)
        }
        delete this.dishes[dishName]
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
        if (this.dishes.hasOwnProperty(dish) || (typeof dish !== "string" || dish.length === 0)) {
            throw new Error(`Dish ${dish} already have in manu`)
        }
        this.dishes[dish] = new EntreesMenu(dish, this.period)
    }
    removeDish(dishName){
        if (!(this.dishes.hasOwnProperty(dishName))) {
            throw new DishNotFoundError(`Dish ${dishName} havet in manu`)
        }
        delete this.dishes[dishName]
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
        if (this.dishes.hasOwnProperty(dish) || (typeof dish !== "string" || dish.length === 0)) {
            throw new Error(`Dish ${dish} already have in manu`)
        }
        this.dishes[dish] = new DessertsMenu(dish, this.kilocalorie)
    }
    removeDish(dishName){
        if (!(this.dishes.hasOwnProperty(dishName))) {
            throw new DishNotFoundError(`Dish ${dishName} havet in manu`)
        }
        delete this.dishes[dishName]
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
        return this.name
    }
    set name(value){
        if(typeof value !== "string" || value.length === 0){
            throw new Error("Name must be non-empty string")
        }
        this.name = value
    }
    get contactInfo(){
        return this.contactInfo
    }
    set contactInfo(value){
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        let mail = "test@example.com"
        if (regex.test(mail)) {
            console.log("Valid Email address")
        } else {
            console.log("Invalid Email address")
        }
        this.contactInfo = value
    }
}
class Order{
    #totalPrice = 0
    constructor(customer){
        this.customer = customer
        this.dishes = []
    }
    addDish(dishName, menus) {
        if(menus.hasOwnProperty(dishName)) {
            this.dishes.push(dishName)
            this.totalPrice += menus[dishName]
        }else{
            console.log(`Dish ${dishName} havnt in manu`)
        }
    }
    getTotal(){
        return this.totalPrice
    }
    viewSummary(){
        console.log(`customer ${this.customer}`)
        console.log(`dishes ${this.dishes}`)
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
        return this.name
    }
    set name(value){
        if(typeof value !== "string" || value.length === 0){
            throw new Error("name must be non-empty string")
        }
        this.name = value
    }
    get price(){
        return this.price
    }
    set price(value){
        if(value < 0){
            throw new Error("price must be positive")
        }
        this.price = value
    }
}