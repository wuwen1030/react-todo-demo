import * as React from 'react';
import './App.css';
import Todo from './Todo'
import TodoItem from './TodoItem'
import * as Utils from './utils'

enum TodoFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed'
}

const TODO_STORE_KEY = 'todo-demo'

interface State {
  todos: Todo[],
  editingTodoId?: number,
  nowShowing: TodoFilter
}

class App extends React.Component {
  newTodoInput: any

  state:State = {
    todos: JSON.parse(localStorage.getItem(TODO_STORE_KEY) || '[]'),
    nowShowing: TodoFilter.All
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

  public render() {
    const shownTodos = this.state.todos.filter( todo => {
      switch (this.state.nowShowing) {
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
            ref={input => this.newTodoInput = input}
            onKeyDown={this.onInputKeydown}
          />
          <section className="main">
            <ul className="todo-list">
              {todoItems}
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

export default App;
