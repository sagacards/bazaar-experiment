import React from 'react'
import { Leva } from 'leva'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from 'screens/home'
import useStore from 'store/index'

function App() {
    React.useEffect(useStore().init, []);
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeScreen />} />
            </Routes>
        </BrowserRouter>
        <Leva
            flat
        />
    </>
}

export default App
