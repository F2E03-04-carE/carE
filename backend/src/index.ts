import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { serverConfig } from './configs/index.js'

dotenv.config()

const app = express()

// ====== 中介軟體 (Middleware) ======
app.use(cors())              // 允許跨網域請求（讓前端可以呼叫 API）
app.use(express.json())      // 解析 JSON 格式的請求內容

// ====== 路由 (Routes) ======

// 首頁路由 - 測試伺服器是否正常運作
app.get('/', (req, res) => {
  res.json({
    message: 'carE API 伺服器運作中',
    version: '1.0.0',
  })
})

// 健康檢查路由 - 用於監控伺服器狀態
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// TODO: 之後在這裡引入其他路由
// import authRoutes from './routes/auth.js'
// import shopRoutes from './routes/shop.js'
// import bookingRoutes from './routes/booking.js'
// app.use('/api/auth', authRoutes)
// app.use('/api/shops', shopRoutes)
// app.use('/api/bookings', bookingRoutes)

// ====== 啟動伺服器 ======
const PORT = serverConfig.port

app.listen(PORT, () => {
  console.log(`伺服器已啟動: http://localhost:${PORT}`)
  console.log(`環境: ${serverConfig.nodeEnv}`)
})
