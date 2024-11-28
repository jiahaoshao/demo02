const WebSocket = require('ws')

const wss = new WebSocket.Server({
  port: 3000
})

// 维护一个客户端连接列表，每个连接都与一个用户标识符相关联
const clients = new Map()

// 创建一个TextDecoder实例来处理字符串
const decoder = new TextDecoder('utf-8')

wss.on('connection', function connection (ws, req) {
  const parsedUrl = new URL(req.url, `http://localhost:${this.options.port}`) // 注意这里我们创建了一个 URL 对象
  const queryParams = parsedUrl.searchParams
  const userId = queryParams.get('userId')

  clients.set(userId, ws)
  console.log(`server: receive connection with userId: ${userId}.`)

  ws.on('message', function incoming (message) {
    console.log('server: received', decoder.decode(message))

    // 解析字符串
    const parsedMessage = JSON.parse(message)
    // 提取
    const { receiver, content, sender, timestamp  } = parsedMessage

    // 查找与该接收者标识符匹配的连接
    const receiverWs = clients.get(receiver)

    if (receiverWs) {
      // 通过匹配的连接发送消息
      receiverWs.send(JSON.stringify({
        senderId: sender,
        content: content,
        isSelf: false,
        time: timestamp
      }))
    } else {
      console.log(`No client found with receiver: ${receiver}`)
      // 可以选择向发送者发送一个错误消息，或者进行其他处理
      ws.send(JSON.stringify({
        error: `No client found with receiver: ${receiver}`
      }))
    }
  })
  // const data1 = {
  //   name: 'zhangsan',
  //   age: 18
  // }
  // const data2 = {
  //   name: 'lisi',
  //   age: 19
  // }
  // const data3 = 'wangwu'
  // sendData(ws, data1, 1000 * 60 * 1)
  // sendData(ws, data2, 1000 * 60 * 2)
  // sendData(ws, data3, 1000 * 60 * 3)
})

const sendData = (ws, data = '', delay = 1000) => {
  if (!data) return
  if (typeof data === 'object') data = JSON.stringify(data)
  setTimeout(() => {
    ws.send(data)
  }, delay)
}
