const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json())

const customers = []

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


app.get('/statement/:cpf', (request, response) => {
  const { cpf } = request.params
  
  const customer = customers.find(custumer => custumer.cpf === cpf)

  if(customer) {
    return response.json(customer.statement)
  }


  return response.status(400).json({error: 'Customer not found'})
})

app.listen(3333, () => console.log('Server started on port 3333'))