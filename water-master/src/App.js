import Cards from "./Components/Cards"
import NavBar from "./Components/NavBar"
import Level from "./Components/Level"
import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Reg from "./Pages/Reg"
import Login from "./Pages/Login"
function App(){
  return(
  <>
    <Routes>
        <Route path="/home" element={ <Home/> } />
        <Route path="/Register" element={ <Reg/> } />
        <Route path="/" element={ <Login/> } />

        
    </Routes>
  </>
   
  )
}

export default App