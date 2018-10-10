import * as React from 'react'
import * as utils from './utils'
import { TodoFilter } from './Todo'

interface Props {
  count: number,
  completedCount: number
  nowShowing: TodoFilter
}

export default class TodoFooter extends React.Component<Props> {
  render () {
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count} {utils.pluralize(this.props.count, 'item')}</strong> left
        </span>
        <ul className="filters">
          <li>
            <a href="/#" className={utils.classNames({selected: this.props.nowShowing === TodoFilter.All})}>All</a>
          </li>
          {'  '}
          <li>
            <a href="/#active" className={utils.classNames({selected: this.props.nowShowing === TodoFilter.Active})}>Active</a>
          </li>
          {'  '}
          <li>
            <a href="/#completed" className={utils.classNames({selected: this.props.nowShowing === TodoFilter.Completed})}>Completed</a>
          </li>
        </ul>
      </footer>
    )
  }
}