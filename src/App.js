import Header from "./components/Header";
import "./index.css";
import Tasks from "./components/Tasks"
import AddTasks from "./components/AddTask"
import { useState, useEffect } from "react"

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
    const res = await fetch("http://192.168.43.120:5000/tasks")
    const data = await res.json()
    return data
  }

  //Fecth a Task
  const fetchTask = async (id) =>{
    const res = await fetch(`http://192.168.43.120:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }



  //Delete task
  const deleteTask =  async (id) => {
    await fetch(`http://192.168.43.120:5000/tasks/${id}`,{
      method: 'DELETE'
    }
    )

    setTasks(tasks.filter((task) => task.id !== id))
  }

  //Add Task
  const addTask = async (task)=>{

    const res = await fetch("http://192.168.43.120:5000/tasks",{
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

    const res = await fetch(`http://192.168.43.120:5000/tasks/${id}`,{
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
    <div className="container">
      <Header onAdd={() => setshowAddTask(!showAddTask) } showAddTask={showAddTask} />
      {showAddTask && <AddTasks onAdd={addTask}/>}
      {tasks.length >0 ? 
      <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> 
      : "No Tasks To Show"}
      
    </div>
  );
}

export default App;
