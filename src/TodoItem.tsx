import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Todo from './Todo'
import * as utils from './utils'

type TodoEvent = (todo?: Todo) => void

interface Props {
  todo: Todo,
  editing: boolean,
  onToggle: TodoEvent,
  onDestory: TodoEvent, 
  onEdit: TodoEvent,
  onSave: (title: string) => void,
  onCancel: TodoEvent
}

interface State {
  editText?:string
}

export default class TodoItem extends React.Component<Props, State> {

  state:State = {}

  componentDidUpdate = (prevProps: Props) => {
    if (!prevProps.editing && this.props.editing) {
      let node = ReactDOM.findDOMNode(this.refs.editField) as HTMLInputElement
      node.focus()
      node.setSelectionRange(node.value.length, node.value.length)
      node.value = this.props.todo.title
    }
  }

  onToggle = () => {
    this.props.onToggle(this.props.todo)
  }

  onEdit = () => {
    this.props.onEdit(this.props.todo)
  }

  onEditKeyDown = (event: React.KeyboardEvent) => {
    let node = ReactDOM.findDOMNode(this.refs.editField) as HTMLInputElement
    switch (event.keyCode) {
      case utils.ENTER_KEY:
        let newTitle = node.value.trim()
        if (newTitle) {
          this.props.onSave(newTitle)
        } else {
          this.props.onDestory()
        }
        break;
      case utils.ESCAPE_KEY:
        node.value = this.props.todo.title
        this.props.onCancel()
        break;
      default:
        break;
    }
  }

  public render() {
    return (
      <li className={utils.classNames({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input 
            type="checkbox"
            className="toggle"
            checked={this.props.todo.completed}
            onChange={this.onToggle}
          />
          <label onDoubleClick={this.onEdit}>
            {this.props.todo.title}
          </label>
          <button className="destroy" onClick={() => this.props.onDestory(this.props.todo)}></button>
        </div>
        <input 
          ref="editField"
          className="edit"
          onKeyDown={this.onEditKeyDown}
        />
      </li>
    )
  }
}