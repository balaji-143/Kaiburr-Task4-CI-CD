import { Drawer, Empty, Timeline, Typography } from 'antd'
import { formatDateTime } from '../utils/date'
import type { Task } from '../types'

type CommandOutputDrawerProps = {
  task?: Task
  open: boolean
  onClose: () => void
}

export function CommandOutputDrawer({ task, open, onClose }: CommandOutputDrawerProps) {
  const executions = task?.taskExecutions ?? []

  return (
    <Drawer
      title={task ? `Execution History • ${task.name}` : 'Execution History'}
      open={open}
      onClose={onClose}
      width={720}
      aria-label="Task execution history drawer"
    >
      {executions.length === 0 ? (
        <Empty description="No executions recorded yet" />
      ) : (
        <Timeline
          mode="left"
          items={executions
            .slice()
            .reverse()
            .map((execution, index) => ({
              color: '#1677ff',
              label: formatDateTime(execution.startTime),
              children: (
                <article aria-label={`Execution ${executions.length - index}`}>
                  <Typography.Title level={5} style={{ marginBottom: 4 }}>
                    Run #{executions.length - index}
                  </Typography.Title>
                  <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
                    Started: {formatDateTime(execution.startTime)} · Finished: {formatDateTime(execution.endTime)}
                  </Typography.Paragraph>
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    <pre className="command-output-block">{execution.output || 'No output captured.'}</pre>
                  </Typography.Paragraph>
                </article>
              )
            }))}
        />
      )}
    </Drawer>
  )
}
