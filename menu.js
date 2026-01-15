class DishNotFoundError extends Error {
    constructor(m) {
        super(m)
        this.name = "DishNotFoundError"
    }
}
class InvalidOrderError extends Error {
    constructor(m) {
        super(m)
        this.name = "InvalidOrderError"
    }
}
class Menu {
    #dishes = []
    constructor() {
        if (new.target === Menu) {
            throw new Error("Cannot instantiate abstract class")
        }
    }
    addDish(dish) {
        if (this.#dishes.find(d => d.name === dish.name)) {
            throw new DishNotFoundError(`Dish ${dish.name} already exists`)
        }
        this.#dishes.push(dish)

    }
    removeDish(dishName) {
        let index = this.#dishes.findIndex(d => d.name === dishName)
        if (index === -1) throw new DishNotFoundError(`Dish ${dishName} not found`)
        this.#dishes.splice(index, 1);

    }
    viewMenu() {
        return [...this.#dishes]
    }
    get dishes() {
        return [...this.#dishes]
    }
    set dishes(value) {
        if (this.#dishes.length === 0) {
            throw new Error("Dishes cant be empty")
        }
        this.#dishes = value
    }
    increasePrice(dishName, percent) {
        let dish = this.dishes.find(d => d.name === dishName)
        if (!dish) {
            throw new DishNotFoundError(dishName)
        }
        dish.price *= 1 + percent / 100
    }
    decreasePrice(dishName, percent) {
        let dish = this.dishes.find(d => d.name === dishName)
        if (!dish) {
            throw new DishNotFoundError(dishName)
        }
        dish.price *= 1 - percent / 100
    }
    applyDemandPricing(popularDishNames) {
        popularDishNames.forEach(name => this.increasePrice(name, 15.5))
    }
}

class AppetizersMenu extends Menu {
    constructor(price) {
        super()
        this.price = price
    }
}
class EntreesMenu extends Menu {
    constructor(period) {
        super()
        this.period = period
    }
}
class DessertsMenu extends Menu {
    constructor(kilocalorie) {
        super()
        this.kilocalorie = kilocalorie
    }
}

class Customer {
    constructor(name, contactInfo) {
        this.name = name
        this.contactInfo = contactInfo
        this.orderHistory = []
    }
    placeOrder(order) {
        if (!(order instanceof Order)) {
            throw new DishNotFoundError("“Invalid order”")
        }
        this.orderHistory.push(order)
    }
    viewOrderHistory() {
        return this.orderHistory
    }
    get name() {
        return this._name
    }
    set name(value) {
        if (typeof value !== "string" || value.length === 0) {
            throw new Error("Name must be non-empty string")
        }
        this._name = value
    }
    get contactInfo() {
        return this._contactInfo
    }
    set contactInfo(value) {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(value)) {
            throw new Error("Invalid Email address")
        }
        this._contactInfo = value
    }
}
class Order {
    #totalPrice = 0
    constructor(customer) {
        this.customer = customer
        this.dishes = []
    }
    addDish(dishName, menus) {
        if (!Array.isArray(menus)) {
            menus = [menus]
        }
        let foundDish = null;
        for (let menu of menus) {
            foundDish = menu.dishes.find(d => d.name === dishName)
            if (foundDish) {
                break
            }
        }
        if (!foundDish) {
            throw new DishNotFoundError(`Dish ${dishName} not found in menus`)
        }

        this.dishes.push(foundDish)
        this.#totalPrice += foundDish.price

    }
    getTotal() {
        return this.totalPrice
    }
    viewSummary() {
        return {
            customer: this.customer.name,
            dishes: this.dishes.map(d => d.name),
            totalPrice: this.totalPrice
        }
    }
    get totalPrice() {
        return this.#totalPrice
    }
}
class Dish {
    constructor(name, price) {
        this.name = name
        this.price = price
    }
    get name() {
        return this._name
    }
    set name(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new Error("name must be non-empty string")
        }
        this._name = value
    }
    get price() {
        return this._price
    }
    set price(value) {
        if (value < 0) {
            throw new Error("price must be positive")
        }
        this._price = value
    }
}
class Appetizer extends Dish { }
class Entree extends Dish { }
class Dessert extends Dish { }

let appetizersMenu = new AppetizersMenu()
let salad = new Appetizer("Salad", 20)
appetizersMenu.addDish(salad)
let ani = new Customer("Ani", "ani@example.com")
let order1 = new Order(ani)
order1.addDish("Salad", appetizersMenu)
console.log(order1.viewSummary())


