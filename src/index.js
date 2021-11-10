const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json())

const customer = []

app.post('/account', (request, response) => {
  const {name, cpf} = request.body
 

  const  customerExists = customer.some(custumer => custumer.cpf === cpf)

  if(customerExists) {
    return response.status(400).json({error: 'Customer already exists'})
  }
  

  customer.push({
    id :uuidv4(),
    name,
    cpf,
    statement: []
  })

  response.status(201).send()


})

app.listen(3333, () => console.log('Server started on port 3333'))