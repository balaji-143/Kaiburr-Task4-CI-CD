import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Drawer, Empty, Form, Input, Popconfirm, Space, Table, Tag, Tooltip, Typography, message } from 'antd'
import type { TableProps } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { CommandOutputDrawer } from '../components/CommandOutputDrawer'
import { createTask, deleteTask, executeTask, fetchTasks } from '../api/tasks'
import type { Task } from '../types'
import { formatDateTime } from '../utils/date'

const { Search } = Input

type TaskWithMeta = Task & { displayIndex?: number }

export default function TaskList() {
  const [tasks, setTasks] = useState<TaskWithMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [historyTask, setHistoryTask] = useState<TaskWithMeta | undefined>()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [pagination, setPagination] = useState<TablePaginationConfig>({ current: 1, pageSize: 8, showSizeChanger: false, total: 0 })

  const enhanceWithIndex = (list: Task[]): TaskWithMeta[] =>
    list.map((task, idx) => ({ ...task, displayIndex: idx + 1 }))

  const loadTasks = useCallback(async (searchTerm?: string) => {
    setLoading(true)
    try {
      const response = await fetchTasks()
      const allTasks = enhanceWithIndex(response.data)

      const trimmed = searchTerm?.trim()
      let nextList: TaskWithMeta[]

      if (!trimmed) {
        nextList = allTasks
      } else if (/^\d+$/.test(trimmed)) {
        const index = Number(trimmed)
        if (index < 1 || index > allTasks.length) {
          nextList = []
          message.info(`No task exists with number ${trimmed}.`)
        } else {
          nextList = [allTasks[index - 1]]
        }
      } else {
        const lower = trimmed.toLowerCase()
        nextList = allTasks.filter(task => task.name?.toLowerCase().includes(lower))
        if (nextList.length === 0) {
          message.info(`No tasks match the name “${trimmed}”.`)
        }
      }

  setTasks(nextList)
  setPagination(prev => ({ ...prev, current: 1, total: nextList.length }))
  setHistoryTask((prev: TaskWithMeta | undefined) => (nextList.length === 0 ? undefined : prev))
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleDelete = useCallback(async (task: Task) => {
    if (!task.id) return
    try {
      await deleteTask(task.id)
      message.success(`Deleted “${task.name}”`)
      loadTasks()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Delete failed')
    }
  }, [loadTasks])

  const handleExecute = useCallback(async (task: Task) => {
    if (!task.id) return
    try {
      const { data } = await executeTask(task.id)
      message.success(`Executed “${task.name}”`)
      setHistoryTask(data)
      setHistoryOpen(true)
      loadTasks()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Execution failed')
    }
  }, [loadTasks])

  const columns: ColumnsType<TaskWithMeta> = useMemo(() => [
    {
      title: '#',
      dataIndex: 'index',
      width: 70,
      render: (_value, task, index) => task.displayIndex ?? (((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 8) + index + 1),
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      sorter: (a, b) => (a.owner || '').localeCompare(b.owner || ''),
      render: (value: string) => value || '—'
    },
    {
      title: 'Command',
      dataIndex: 'command',
      responsive: ['md'],
      render: (command: string) => (
        <Tooltip title={command}>
          <Tag color="geekblue" style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis' }}>{command}</Tag>
        </Tooltip>
      )
    },
    {
      title: 'Last Run',
      dataIndex: 'taskExecutions',
      responsive: ['md'],
      render: (_, task) => formatDateTime(task.taskExecutions?.[task.taskExecutions.length - 1]?.endTime)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, task) => (
        <Space wrap>
          <Button type="link" onClick={() => handleExecute(task)} aria-label={`Execute ${task.name}`}>
            Run
          </Button>
          <Button type="link" onClick={() => {
            setHistoryTask(task)
            setHistoryOpen(true)
          }} aria-label={`View output for ${task.name}`}>
            Output
          </Button>
          <Popconfirm
            title="Delete task"
            description={`Delete “${task.name}”? This cannot be undone.`}
            onConfirm={() => handleDelete(task)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger aria-label={`Delete ${task.name}`}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 180
    }
  ], [handleDelete, handleExecute, pagination.current, pagination.pageSize])

  const handleTableChange: TableProps<TaskWithMeta>['onChange'] = newPagination => {
    setPagination(prev => ({ ...prev, ...newPagination }))
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card
        title={<Typography.Title level={3} style={{ margin: 0 }}>Tasks</Typography.Title>}
        extra={
          <Space>
            <Tooltip title="Create a new task">
              <Button type="primary" onClick={() => setCreateOpen(true)}>
                New Task
              </Button>
            </Tooltip>
            <Button onClick={() => loadTasks()} aria-label="Refresh task list">
              Refresh
            </Button>
          </Space>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Search
            placeholder="Search by task name or number"
            allowClear
            enterButton="Search"
            onSearch={value => loadTasks(value)}
            aria-label="Search tasks by name or number"
          />

          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Use “New Task” to add commands, search by name or number, run tasks to record output, and view history via the Output action.
          </Typography.Paragraph>

          {tasks.length === 0 ? (
            <Empty description="No tasks yet. Create your first task to get started." />
          ) : (
            <Table
              rowKey={task => task.id ?? task.name}
              columns={columns}
              dataSource={tasks}
              loading={loading}
              pagination={pagination}
              scroll={{ x: true }}
              onChange={handleTableChange}
              aria-label="Task list table"
            />
          )}
        </Space>
      </Card>

      <TaskCreationDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false)
          loadTasks()
        }}
      />

      <CommandOutputDrawer
        task={historyTask}
        open={historyOpen}
        onClose={() => {
          setHistoryOpen(false)
          setHistoryTask(undefined)
        }}
      />
    </Space>
  )
}

type TaskCreationDrawerProps = {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

function TaskCreationDrawer({ open, onClose, onCreated }: TaskCreationDrawerProps) {
  const [form] = Form.useForm<Task>()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: Task) => {
    setSubmitting(true)
    try {
      await createTask(values)
      message.success('Task created')
      form.resetFields()
      onCreated()
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Create failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer
      title="Create new task"
      open={open}
      onClose={onClose}
      width={480}
      destroyOnClose
      aria-label="Create task drawer"
    >
      <Typography.Paragraph type="secondary">
        Provide a descriptive name, owner, and the command you want to run from the backend service.
      </Typography.Paragraph>

      <Form<Task>
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        requiredMark
      >
        <Form.Item
          label="Task name"
          name="name"
          rules={[{ required: true, message: 'Please enter a task name' }]}
        >
          <Input placeholder="e.g. List home directory" autoFocus aria-required="true" />
        </Form.Item>

        <Form.Item
          label="Owner"
          name="owner"
          rules={[{ required: true, message: 'Please enter the owner name' }]}
        >
          <Input placeholder="Who owns this task?" aria-required="true" />
        </Form.Item>

        <Form.Item
          label="Command"
          name="command"
          rules={[
            { required: true, message: 'Please provide a command' },
            {
              validator: (_rule, value: string) => {
                const unsafe = /[;|`&]/
                if (value && unsafe.test(value)) {
                  return Promise.reject(new Error('Command cannot contain shell chaining characters (;&|`).'))
                }
                return Promise.resolve()
              }
            }
          ]}
          extra="Commands run on the backend without shell chaining, pipes, or command separators."
        >
          <Input placeholder="e.g. ls -al" aria-required="true" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={onClose} aria-label="Cancel creating task">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting} aria-label="Submit new task">
              Create task
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
