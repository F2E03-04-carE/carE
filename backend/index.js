import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()

// ====== 中介軟體 (Middleware) ======
app.use(cors())
app.use(express.json())

// ====== 路由 (Routes) ======
// TODO: 之後引入路由
// import usersRouter from './src/routes/users.js'
// import shopsRouter from './src/routes/shops.js'
// app.use("/users", usersRouter)
// app.use("/shops", shopsRouter)

// 測試用路由
app.get('/', (req, res) => {
  res.json({ message: 'carE API 伺服器運作中' })
})

// ====== 啟動伺服器 ======
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
