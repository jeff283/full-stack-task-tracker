import Header from "./components/Header";
import "./index.css";
import Tasks from "./components/Tasks"
import AddTasks from "./components/AddTask"
import Footer from "./components/Footer"
import About from "./components/About"
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"


function App() {

  const [showAddTask, setshowAddTask] = useState(false)


  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTask = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTask()

  }, [])


  //Fetch Tasks
  const fetchTasks = async () =>{
    const res = await fetch("http://localhost:5000/task") 
    const data = await res.json()
    // console.log(data)
    return data
  }

  //Fecth a Task
  const fetchTask = async (id) =>{
    const res = await fetch(`http://localhost:5000/task/${id}`)
    const data = await res.json()
    return data
  }



  //Delete task
  const deleteTask =  async (id) => {
    await fetch(`http://localhost:5000/task/${id}`,{
      method: 'DELETE'
    }
    )

    setTasks(tasks.filter((task) => task.id !== id))
  }

  //Add Task
  const addTask = async (task)=>{

    const res = await fetch("http://localhost:5000/task",{
      method:'POST',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data])


    // const id = Math.floor(Math.random() *10000) +1

    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask ])
  }


  //Toggle reminder
  const toggleReminder = async (id) =>{

    const taskToToggle = await fetchTask(id)
    const updatedTask = {...taskToToggle,
    reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/task/${id}`,{
      method: "PUT",
      headers: {
        "Content-type":"application/json"
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()

    setTasks(tasks.map((task) => task.id === id 
    ? {...task, reminder:data.reminder} : task))
  }


  return (
    <Router>
    <div className="container">
      <Header onAdd={() => setshowAddTask(!showAddTask) } showAddTask={showAddTask} />
      

      
      <Route path="/" exact render={(props) =>(
        <>
              {showAddTask && <AddTasks onAdd=
      {addTask}/>}
      {tasks.length >0 ? (
      <Tasks tasks={tasks} 
      onDelete={deleteTask} 
      onToggle={toggleReminder}/> )
      : ("No Tasks To Show")}

        </>
      )}/>
      <Route path="/about" component={About}/>
      <Footer />
      
    </div>
    </Router>
  );
}

export default App;
