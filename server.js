const http = require('http')
const { randomUUID } = require('crypto')

let users = []
const server = http.createServer((req, res) => {
  const METHOD = req.method
  const URL = req.url
  if(URL.startsWith('/users')){
    if(METHOD === 'POST'){
    req.on('data', (data) => {
      const body = JSON.parse(data)
      const user = {
        ...body,
        id: randomUUID(),
      }
      users.push(user)
      return res.end(JSON.stringify(user))
    })
  }
  if(METHOD === 'GET'){
    return res.end(JSON.stringify(users))
  }
  if(METHOD === 'PUT'){
    const paramsSplit = URL.split('/')
    const id = paramsSplit[-1]

    req.on('data', (data) => {
      const body = JSON.parse(data)

      const userIndex = users.findIndex(user => user.id === id)

      if(userIndex <= -1){
        return res.end(
          JSON.stringify({
          message: 'Usuário não encontrado'
          })
        )
      }

      users[userIndex] = {
        ...body,
        id,
      }
    })
    .on('end', () => {
      return res.end(
        JSON.stringify({
          message: 'Usuário alterado com sucesso!',
        })
      )
    })
  }
}
})

server.listen('3335', () => console.log('SerVer Running at port 3335'))

process.on('uncaughtException', (err) => 
  console.log(`Erro no servidor ${err}`)
)
