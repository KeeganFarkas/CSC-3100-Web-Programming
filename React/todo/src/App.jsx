import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/sweetalert2/dist/sweetalert2.min.css'
import SweetAlert2 from 'react-sweetalert2'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [strTaskName, setTaskName] = useState('')
  const [swalProps, setSwalProps] = useState({})

  return (
    <>
      {/* // create a form that takes inputs for task name, task location, due date, and a button to add the task */}
      <div className="container">
        <h1>Todo App</h1>
        <form>
          <div className="mb-3">
            <label for="taskName" className="form-label">Task Name</label>
            <input type="text" className="form-control" id="taskName" value={strTaskName} onChange={(e) => setTaskName(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label for="taskLocation" className="form-label">Task Location</label>
            <input type="text" className="form-control" id="taskLocation" />
          </div>
          <div className="mb-3">
            <label for="dueDate" className="form-label">Due Date</label>
            <input type="date" className="form-control" id="dueDate" />
          </div>
          <button type="button" className="btn btn-primary" onClick={() => {setSwalProps({show:true, title:'Success', icon:'success', text:`New Task Added: ${strTaskName}`})}}>Add Task</button>
          <SweetAlert2 {...swalProps}/>
        </form>
      </div>
    </>
  )
}

export default App
