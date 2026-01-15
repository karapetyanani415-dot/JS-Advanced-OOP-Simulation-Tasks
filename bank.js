class InsufficientFundsError extends Error {
    constructor(m) {
        super(m)
        this.name = "InsufficientFundsError"
    }
}
class InvalidTransactionError extends Error {
    constructor(m) {
        super(m)
        this.name = "InvalidTransactionError"
    }
}
class AuthorizationError extends Error {
    constructor(m) {
        super(m)
        this.name = "Authorization Error"
    }
}
class ValidationError extends Error {
    constructor(m) {
        super(m)
        this.name = "Validation Error"
    }
}

class BankAccount {
    #balance = 0
    #transactions = []
    constructor(accountNumber, type) {
        if (new.target === BankAccount) {
            throw new Error("Cannot instantiate abstract class")
        }
        this.accountNumber = accountNumber
        this.type = type
    }
    deposit(amount) {
        throw new Error("deposit() must be implemented in subclass")
    }
    withdraw(amount) {
        throw new Error("withdraw() must be implemented in subclass")
    }
    getBalance() {
        throw new Error("getBalance() must be implemented in subclass")
    }
    transferFunds(targetAccount, amount, actor) {
        throw new Error("transferFunds() must be implemented in subclass")
    }
    get balance() {
        return this.#balance
    }
    get transactions() {
        return [...this.#transactions]
    }
    set transactions(value) {
        if (this.#transactions.length == 0) {
            throw new ValidationError("Transactions cant be empty");
        }
    }
    _addTransaction(tx) {
        this.#transactions.push(tx);
    }
    set balance(value) {
        if (value < 0) {
            throw new ValidationError("Balance cannot be negative")
        }
        this.#balance = value;
    }
}
Object.defineProperty(BankAccount.prototype, "accountNumber", {
    get() {
        return this._accountNumber
    },
    set(value) {
        if (!/^\d{10}$/.test(value)) {
            throw new ValidationError("Account number must be 10 digits")
        }
        this._accountNumber = value
    }
})
Object.defineProperty(BankAccount.prototype, "type", {
    get() {
        return this._type
    },
    set(value) {
        if (typeof value !== "string") {
            throw new ValidationError("type must be string")
        }
        this._type = value
    }
})

class IndividualAccount extends BankAccount {
    constructor(accountNumber) {
        super(accountNumber, "individual")
    }

    deposit(amount) {
        if (amount <= 0) {
            throw new ValidationError("Deposit must be positive")
        }
        this.balance += amount
        this.transactions.push(new Transaction(this.accountNumber, amount, "deposit"))
    }
    withdraw(amount) {
        if (amount <= 0) {
            throw new ValidationError("Withdrawal must be positive")
        }
        if (this.balance < amount) {
            throw new InsufficientFundsError("Insufficient funds")
        }
        this.balance -= amount
        this._addTransaction(new Transaction(this.accountNumber, amount, "withdraw"))
    }
    transferFunds(targetAccount, amount, actor) {
        if (!(targetAccount instanceof BankAccount)) {
            throw new InvalidTransactionError("Target must be a BankAccount")
        }
        if (amount <= 0) {
            throw new ValidationError("Transfer amount must be positive")
        }
        if (this.balance < amount) {
            throw new InsufficientFundsError("Insufficient funds")
        }
        this.balance -= amount
        targetAccount.balance += amount
        this._addTransaction(new Transaction(this.accountNumber, amount, "transfer"))
        targetAccount._addTransaction(new Transaction(targetAccount.accountNumber, amount, "deposit"))
    }
    getBalance() {
        return this.balance
    }
}

class JointAccount extends BankAccount {
    constructor(accountNumber, owners) {
        super(accountNumber, "joint")
        this.owners = owners
    }
    deposit(amount) {
        if (amount <= 0) {
            throw new ValidationError("Deposit must be positive")
        }
        this.balance += amount
        this._addTransaction(new Transaction(this.accountNumber, amount, "deposit"))
    }
    withdraw(amount) {
        if (amount <= 0) {
            throw new ValidationError("Withdrawal must be positive")
        }
        if (this.balance < amount) {
            throw new InsufficientFundsError("Insufficient funds")
        }
        this.balance -= amount
        this._addTransaction(new Transaction(this.accountNumber, amount, "withdraw"))
    }
    transferFunds(targetAccount, amount, actor) {
        if (!this.owners.includes(actor)) {
            throw new AuthorizationError("You are not an account owner")
        }
        if (!(targetAccount instanceof BankAccount)) {
            throw new InvalidTransactionError("Target must be a BankAccount")
        }
        if (amount <= 0) {
            throw new ValidationError("Transfer amount must be positive")
        }
        if (this.balance < amount) {
            throw new InsufficientFundsError("Insufficient funds")
        }
        this.balance -= amount
        targetAccount.balance += amount
        this._addTransaction(new Transaction(this.accountNumber, amount, "transfer"))
        targetAccount._addTransaction(new Transaction(targetAccount.accountNumber, amount, "deposit"))
    }
    getBalance() {
        return this.balance
    }
    set owners(value) {
        if (!Array.isArray(value) || value.length === 0) {
            throw new ValidationError("Owners list cannot be empty")
        }
        this._owners = value
    }
    get owners() {
        return this._owners
    }
}

class Customer {
    constructor(name, contactInfo) {
        this.name = name
        this.contactInfo = contactInfo
        this.accounts = []
    }
    addAccount(account) {
        if (!(account instanceof BankAccount)) {
            throw new ValidationError("Must be a BankAccount")
        }
        this.accounts.push(account)
    }
    viewAccounts() {
        for (let i of this.accounts) {
            console.log(i)
        }
    }
    viewTransactionHistory(accountNumber) {
        const account = this.accounts.find(a => a.accountNumber === accountNumber)
        if (!account) throw new ValidationError("Account not found for this customer")
        return account.transactions
    }
}
Object.defineProperty(Customer.prototype, "name", {
    get() {
        return this._name
    },
    set(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new ValidationError("Name must be non-empty string")
        }
        this._name = value
    }
})

class Transaction {
    constructor(accountNumber, amount, transactionType) {
        this.accountNumber = accountNumber
        this.amount = amount
        this.transactionType = transactionType
        this.timestamp = Date.now()
    }
    set transactionType(value) {
        if (value.length === 0) {
            throw new ValidationError("empty")
        }
        if (!["deposit", "withdraw", "transfer"].includes(value)) {
            throw new ValidationError("transaction type")
        }
        this._transactionType = value
    }
    get transactionType() {
        return this._transactionType
    }

}

let account1 = new IndividualAccount("1234567890")
account1.deposit(100)
console.log(account1.getBalance()) 
account1.withdraw(90)
console.log(account1.getBalance()) 

let account2 = new JointAccount("0987654321", ["Ani", "Lilit"])
account2.deposit(300)
console.log(account2.getBalance())
account2.withdraw(400)
console.log(account2.getBalance()) 

account2.transferFunds(account1, 500, "Ani")
console.log(account2.getBalance()) 
console.log(account1.getBalance())  