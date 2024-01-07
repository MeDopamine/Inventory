import React from "react";
import { Routes, Route } from "react-router-dom";
// import Home from "./Routes/Home";
import Home from "./routes/Home"
import Test from "./routes/Test";
import NewTest from "./routes/NewTest"
import TestNew from "./routes/TestNew"
import TestDate from "./routes/TestDate"
import LazyLoad from "./routes/lazyLoad"
import Newlazyload from "./routes/NewLazyLoad"

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>} /> 
            <Route path="/test" element={<Test/>} /> 
            <Route path="/newtest" element={<NewTest/>} /> 
            <Route path="/testnew" element={<TestNew/>} /> 
            <Route path="/testdate" element={<TestDate/>} /> 
            <Route path="/lazyLoad" element={<LazyLoad/>} /> 
            <Route path="/newLazyLoad" element={<Newlazyload/>} /> 
        </Routes>
    );
};

export default App;
