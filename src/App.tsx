import React from 'react'
import { Leva } from 'leva'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from 'screens/home'

function App() {
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
