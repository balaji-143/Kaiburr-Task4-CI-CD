import { Routes, Route } from 'react-router-dom'
import { Layout, Typography, theme } from 'antd'
import TaskList from './pages/TaskList'

const { Header, Content, Footer } = Layout

export default function App() {
  const { token } = theme.useToken()
  const currentYear = new Date().getFullYear()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: token.colorPrimary,
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.16)'
        }}
      >
        <Typography.Title
          level={3}
          style={{ color: token.colorTextLightSolid, margin: 0 }}
          aria-label="Task Manager heading"
        >
          Task Manager
        </Typography.Title>
      </Header>
      <Content style={{ padding: '32px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1100 }}>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="*" element={<TaskList />} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Task Manager UI · {currentYear}</Footer>
    </Layout>
  )
}
