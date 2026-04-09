# Give Me Money

A single-page app that generates a random payment amount (CNY 3.50 ~ 100.00) and lets you pay via Stripe — without seeing the amount beforehand.

[中文](#中文) | [English](#english) | [日本語](#日本語)

---

## English

### Features

- Random amount between **¥3.50 ~ ¥100.00** generated on page load
- Amount is hidden until you reach the Stripe checkout
- Embedded Stripe Checkout (card + Alipay)
- Thank-you page showing the paid amount
- Neumorphism UI design, responsive for mobile & desktop

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Cloudflare Pages Functions |
| Payment | Stripe Embedded Checkout |
| Hosting | Cloudflare Pages |

### Setup

1. Clone the repo

```bash
git clone https://github.com/SeimoDev/GiveMeMoney.git
cd GiveMeMoney
npm install
```

2. Create a `.env` file

```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Run locally

```bash
npm run dev
```

### Deploy to Cloudflare Pages

1. Connect the GitHub repo in Cloudflare Pages Dashboard
2. Build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variables:
   - `STRIPE_SECRET_KEY` (Runtime)
   - `VITE_STRIPE_PUBLISHABLE_KEY` (Build)

### Project Structure

```
├── functions/
│   └── api/
│       └── checkout.js      # Stripe Checkout session (CF Workers)
├── src/
│   ├── App.jsx              # Main page
│   ├── App.css              # Neumorphism styles
│   └── main.jsx             # Entry point
├── server.js                # Express server (local dev alternative)
└── package.json
```

### License

MIT

---

## 中文

### 功能特性

- 页面加载时随机生成 **¥3.50 ~ ¥100.00** 的金额
- 点击付款前无法看到金额
- 页内嵌入式 Stripe 支付（银行卡 + 支付宝）
- 支付成功后显示感谢页面及付款金额
- 拟物拟态 UI 设计，适配手机与电脑

### 技术栈

| 层级 | 技术 |
|------|-----|
| 前端 | React + Vite |
| 后端 | Cloudflare Pages Functions |
| 支付 | Stripe Embedded Checkout |
| 托管 | Cloudflare Pages |

### 快速开始

1. 克隆仓库

```bash
git clone https://github.com/SeimoDev/GiveMeMoney.git
cd GiveMeMoney
npm install
```

2. 创建 `.env` 文件

```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. 本地运行

```bash
npm run dev
```

### 部署到 Cloudflare Pages

1. 在 Cloudflare Pages 控制台连接 GitHub 仓库
2. 构建设置：
   - 框架预设：`Vite`
   - 构建命令：`npm run build`
   - 输出目录：`dist`
3. 添加环境变量：
   - `STRIPE_SECRET_KEY`（运行时变量）
   - `VITE_STRIPE_PUBLISHABLE_KEY`（构建变量）

### 项目结构

```
├── functions/
│   └── api/
│       └── checkout.js      # Stripe Checkout 会话（CF Workers）
├── src/
│   ├── App.jsx              # 主页面
│   ├── App.css              # 拟物拟态样式
│   └── main.jsx             # 入口文件
├── server.js                # Express 服务器（本地开发备选）
└── package.json
```

### 许可证

MIT

---

## 日本語

### 機能

- ページ読み込み時に **¥3.50 ~ ¥100.00** のランダムな金額を生成
- 決済前に金額を確認できない
- ページ内埋め込み型 Stripe 決済（カード + Alipay）
- 決済完了後に支払い金額を表示する感謝ページ
- ニューモーフィズム UI デザイン、モバイル・デスクトップ対応

### 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | React + Vite |
| バックエンド | Cloudflare Pages Functions |
| 決済 | Stripe Embedded Checkout |
| ホスティング | Cloudflare Pages |

### セットアップ

1. リポジトリをクローン

```bash
git clone https://github.com/SeimoDev/GiveMeMoney.git
cd GiveMeMoney
npm install
```

2. `.env` ファイルを作成

```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. ローカルで実行

```bash
npm run dev
```

### Cloudflare Pages へのデプロイ

1. Cloudflare Pages ダッシュボードで GitHub リポジトリを接続
2. ビルド設定：
   - フレームワークプリセット：`Vite`
   - ビルドコマンド：`npm run build`
   - 出力ディレクトリ：`dist`
3. 環境変数を追加：
   - `STRIPE_SECRET_KEY`（ランタイム）
   - `VITE_STRIPE_PUBLISHABLE_KEY`（ビルド）

### ライセンス

MIT
