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

app.listen(3333, () => console.log('Server started on port 3333'))