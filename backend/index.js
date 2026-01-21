import express from 'express'
import cors from 'cors'
import taxIdRoutes from './src/routes/taxId.js';
import searchRoutes from './src/routes/search.js';
import 'dotenv/config'


const app = express()

// CORS 設定：根據環境變數允許對應的前端網域
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL // 生產環境：使用環境變數設定的前端網址
    : ['http://localhost:5173', 'http://localhost:5174'], // 開發環境：允許本地前端
  credentials: true,
};

app.use(cors(corsOptions))
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


app.use('/api', taxIdRoutes);
app.use('/api', searchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
