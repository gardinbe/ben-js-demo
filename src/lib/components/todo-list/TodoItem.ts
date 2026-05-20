import { type Component, derived, html, normalize, type Props } from 'ben-js'

import { formatDate } from '~/lib/utils/format'

export type Todo = {
  completed: boolean
  content: string
  date: string
  id: number
  priority: number
  title: string
}

export type TodoItemProps = Props<Todo>

export const TodoItem = (props: TodoItemProps): Component => {
  const { content, date, title } = normalize(props)
  return html`
    <div>
      <h3>${title}</h3>
      <div>${content}</div>
      <time datetime="${date}">${derived(() => formatDate(date.value))}</time>
    </div>
  `
}
