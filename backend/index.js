import express from 'express'
import cors from 'cors'
import taxIdRoutes from './src/routes/taxId.js';
import 'dotenv/config'


const app = express()

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

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.use('/api', taxIdRoutes);