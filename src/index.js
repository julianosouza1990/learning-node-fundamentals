const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json())

const customers = []
//Middleware
const verifyAccountExistsCPF = function(request, response, next) {
  const { cpf } = request.headers
  
  const customer = customers.find(custumer => custumer.cpf === cpf)

  if(!customer) {
    return response.status(400).json({error: 'Customer not found'})
  }
  request.customer = customer
  next()
}


function getBalance(statement) {
  return statement.reduce((acc, item) => {
    if(item.type === 'credit') {
      return acc + item.amount
    }
    return acc - item.amount
  }, 0)
}
app.post('/account', (request, response) => {
  const {name, cpf} = request.body
 

  const  customerExists = customers.some(custumer => custumer.cpf === cpf)

  if(customerExists) {
    return response.status(400).json({error: 'Customer already exists'})
  }
  

  customers.push({
    id :uuidv4(),
    name,
    cpf,
    statement: []
  })

  response.status(201).send()


})


app.get('/statement', verifyAccountExistsCPF, (request, response) => {
  
  const { customer } = request

  return response.json(customer.statement)

})


app.get('/statement/date', verifyAccountExistsCPF, (request, response) => {
  
  const { date } = request.body
  const { customer } = request
  const formattedDate = new Date(date + " 00:00")

  const statement = customer.statement.filter(stmt => stmt.created_at.toDateString() === formattedDate.toDateString())

  return response.json(statement)
  
  


})

app.post('/deposit', verifyAccountExistsCPF, (request, response) => {
  const {description, amount } = request.body
  const { customer } = request

  const statementOperation = {
    id: uuidv4(),
    description,
    amount,
    created_at: new Date(),
    type: 'credit'
    
  }
  customer.balance += amount
  customer.statement.push(statementOperation)
  response.status(201).send(customer.statement)
})

app.post("/withdraw",verifyAccountExistsCPF, (request, response) => {
  const { description, amount } = request.body
  const { customer } = request
 
 const balance = getBalance(customer.statement)
 if(balance < amount) {
  return response.json({error: 'Insufficient funds'})
 }

 const statementOperation = {
  id: uuidv4(),
  description,
  amount,
  created_at: new Date(),
  type: 'withdraw'
}

  customer.statement.push(statementOperation)
  response.status(201).send({transactionId: statementOperation.id})
})
app.listen(3333, () => console.log('Server started on port 3333'))