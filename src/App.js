import React, { useEffect, useState } from 'react';
import './App.css';
import Preloader from './components/Preloader';
import { createTodo, deleteTodo, readTodos, updateTodo } from './functions';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';

function App() {

  const [todo, setTodo] = useState({ title: '', content: '' })
  const [todos, setTodos] = useState(null)
  const [currentId, setCurrentId] = useState(0)
  const [update, setupdate] = useState(false)



  useEffect(() => {
    let currentTodo = currentId !== 0 ? todos.find(todo => todo._id === currentId) :
      { title: '', content: '' }
    setTodo(currentTodo)
  }, [currentId])

  const fetchData = async () => {
    let result = await readTodos();
    result = result.map((e) => {
      return { ...e, check: e.check ?? false }
    })
    console.log(result)
    setTodos(result)
  }

  useEffect(() => {

    fetchData()
  }, [])

  const clear = () => {
    setCurrentId(0);
    setTodo({ title: '', content: '' })
  }

  useEffect(() => {
    const clearField = (e) => {
      if (e.keyCode === 27) {
        clear()
      }
    }
    window.addEventListener('keydown', clearField)
    return () => window.removeEventListener('keydown', clearField)
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (currentId === 0) {
      const result = await createTodo(todo)
      setTodos([...todos, result])
      clear();
    } else {
      await updateTodo(currentId, todo).then(() => fetchData())
      setupdate(false)
      clear();
    }

  }

  const removeTodo = async (id) => {
    await deleteTodo(id);
    const todosCopy = [...todos]
    todosCopy.filter(todo => todo._id !== id)
    setTodos(todosCopy)
    fetchData()
  }

  const striketodo = (index) => {
    console.log(todos);
    const newTodos = [...todos];
    newTodos[index].check = !newTodos[index].check;
    setTodos(newTodos);
  };

  console.log(update, "shush")

  return (
    <div className='app'>
      <div className="container">
        <div className="row">
          <div className='content'>
            <pre>{JSON.stringify(todo)}</pre>
          </div>
          <form className="col s12" onSubmit={onSubmitHandler}>
            <div className="row">
              <div className="input-field col s6">
                <i className="material-icons prefix">title</i>
                <input id="icon_prefix" type="text" className="validate"
                  value={todo.title}
                  onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                ></input>
                <label htmlFor="icon_prefix">Title</label>
              </div>
              <div className="input-field col s6">
                <i className="material-icons prefix">description</i>
                <input id="description" type="tel" className="validate"
                  value={todo.content}
                  onChange={(e) => setTodo({ ...todo, content: e.target.value })}
                ></input>
                <label htmlFor="description">Content</label>
              </div>
            </div>
            <div className='row right-align'>
              <button className='waves-effect waves-light btn'>
                {update ? "Update" : "Add"}
              </button>
            </div>
          </form>
          {
            !todos ? <Preloader /> : todos.length > 0 ?
              <ul className="collection">
                {todos.map((todo, i) => (
                  <li key={todo._id}

                    className="collection-item">

                    <div>

                      <h5 className='blue-text text-darken-4'>

                        <Checkbox
                          onClick={() => {

                            striketodo(i)

                          }
                          }
                          checked={todo.check}
                        />

                        <label style={{ textDecoration: todo.check ? "line-through" : "none", fontSize: "20px", fontWeight: "bold" }}>
                          {todo.title}
                        </label>
                      </h5>

                      <p className='black-text text-darken-2'>{todo.content}
                        <a href="#!"
                          onClick={() => removeTodo(todo._id)}
                          className="secondary-content">
                          <i className="material-icons">delete</i>

                        </a>
                        <a href="#!"
                          onClick={() => {
                            setupdate(true)
                            setCurrentId(todo._id)
                          }}
                          className="secondary-content">

                          <EditIcon color="secondary"
                            style={{ margin: "5px" }} />
                        </a>
                      </p>
                    </div>
                  </li>



                ))}

              </ul> : <div><h5>Nothing To Do</h5></div>
          }


        </div>
      </div>
    </div>
  );
}

export default App;
