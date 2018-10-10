import * as React from 'react'
import * as PropTypes from 'prop-types'
import './App.css'
import Todo, {TodoFilter} from './Todo'
import TodoItem from './TodoItem'
import * as Utils from './utils'
import TodoFooter from './footer'
import { RouterChildContext } from 'react-router'

const TODO_STORE_KEY = 'todo-demo'

interface State {
  todos: Todo[],
  editingTodoId?: number | null
}

class App extends React.Component<{}, State> {

  static contextTypes:React.ValidationMap<any> = {
    router: PropTypes.object.isRequired
  }

  constructor(props: {}) {
    super(props)
    this.state = {
      todos: JSON.parse(localStorage.getItem(TODO_STORE_KEY) || '[]')
    }
  }

  store = () => {
    localStorage.setItem(TODO_STORE_KEY, JSON.stringify(this.state.todos))
  }

  onInputKeydown = (event: React.KeyboardEvent) => {
    if (event.keyCode !== Utils.ENTER_KEY) {
      return
    }
    let target = event.target as HTMLInputElement
    let newTodoTitle = target.value.trim()
    if (newTodoTitle.length > 0) {
      this.setState({
        todos: this.state.todos.concat({
          id: this.state.todos.length,
          title: newTodoTitle,
          completed: false
        }),
      }, this.store)
    }
    target.value = ''
  }

  toggle = (candicate?: Todo) => {
    if (!candicate) {
      return
    }
    let newTodos = this.state.todos.map( todo => {
      return todo.id !== candicate.id ? todo : {
        id: todo.id,
        title: todo.title,
        completed: !todo.completed
      }
    })
    this.setState({
      todos: newTodos
    }, this.store)
  }

  edit = (todo?: Todo) => {
    if (todo) {
      this.setState({
        editingTodoId: todo.id
      })
    }
  }

  save = (newTitle: string) => {
    let newTodos = this.state.todos.map( todo => {
      return todo.id !== this.state.editingTodoId ? todo : {
        id: todo.id,
        title: newTitle,
        completed: todo.completed
      }
    })

    this.setState({
      todos: newTodos
    })
    this.setState({
      todos: newTodos,
      editingTodoId: null
    }, this.store)
  }

  destory = (candicate?: Todo) => {
    if (!candicate) {
      return
    }
    let newTodos = this.state.todos.filter( todo => {
      return todo.id !== candicate.id
    })
    this.setState({
      todos: newTodos,
      editingTodoId: null
    }, this.store)
  }

  cancel = (todo?: Todo) => {
    this.setState({
      editingTodoId: null
    })
  }

  render() {
    let path = '/'
    let context = this.context as RouterChildContext
    if (context) {
      console.log(context)
      path = context.router.route.location.pathname
    }
    path = path.substring(1)

    let nowShowing = TodoFilter.All
    switch (path) {
      case 'active': 
        nowShowing = TodoFilter.Active
        break;
      case 'completed':
        nowShowing = TodoFilter.Completed
        break;
      default:
        nowShowing = TodoFilter.All
    }

    // todo list
    const shownTodos = this.state.todos.filter( todo => {
      switch (nowShowing) {
        case TodoFilter.Active:
          return !todo.completed
        case TodoFilter.Completed:
          return todo.completed
        default:
          return true
      }
    })
    const todoItems = shownTodos.map(todo => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          editing={this.state.editingTodoId === todo.id}
          onToggle={this.toggle}
          onDestory={this.destory}
          onEdit={this.edit}
          onSave={this.save}
          onCancel={this.cancel}
        />
      )
    })

    // footer
    const activeTodoCount = this.state.todos.reduce( (accumulator, todo) => {
      return todo.completed ? accumulator : accumulator + 1
    }, 0)
    const completedTodoCount = this.state.todos.length - activeTodoCount
    let footer
    if (this.state.todos.length > 0) {
      footer = 
      <TodoFooter
        count={activeTodoCount}
        completedCount={completedTodoCount}
        nowShowing={nowShowing}
      />
    }

    return (
      <div className="todoapp">
        <header>
          <h1>todos</h1>
        </header>
        <div className="todo-content">
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus={true}
            onKeyDown={this.onInputKeydown}
          />
          <section className="main">
            <ul className="todo-list">
              {todoItems}
            </ul>
          </section>
          {footer}
        </div>
        <footer className="info">
            <p>Double-click to edit a todo</p>
            <p>Created by <a href="http://github.com/wuwen1030/">wuwen</a></p>
        </footer>
      </div>
    );
  }
}

export default App;
