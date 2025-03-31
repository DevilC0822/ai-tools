## 配置

### 创建 .env.local 文件
```bash
cp .env.example .env.local
```

### 配置环境变量

```bash
# MongoDB 连接字符串
MONGODB_URI=

# 大模型 API key 按需配置
# Grok key
GROK_KEY=
# Siliconflow key
SILICONFLOW_KEY=
# Google Gemini key
GEMINI_KEY=
# Volcengine key
VOLCENGINE_KEY=
# Deepseek key
DEEPSEEK_KEY=
```

## 运行

```bash
pnpm install
pnpm run dev
```

## 部署

```bash
pnpm run build
pnpm run start
```
