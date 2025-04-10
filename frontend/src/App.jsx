import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import Body from "./components/Body";
import Login from "./pages/Login";
import MovieDetail from "./pages/MovieDetail";
import BookingMovies from "./pages/BookingMovies";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Movies />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/book/:id" element={<BookingMovies />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
