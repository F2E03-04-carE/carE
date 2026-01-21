import express from 'express'
import cors from 'cors'
import taxIdRoutes from './src/routes/taxId.js';
import searchRoutes from './src/routes/search.js';
import 'dotenv/config'


const app = express()

// CORS 設定：允許前端跨域請求
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://care-f.zeabur.app',
  process.env.FRONTEND_URL, // 額外的自訂網域
].filter(Boolean); // 過濾掉 undefined

const corsOptions = {
  origin: (origin, callback) => {
    // 允許沒有 origin 的請求（例如 Postman、curl）
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
