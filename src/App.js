import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap/dist/js/bootstrap.bundle';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './Component/Layout/TopBar';
import Home from './Component/Frontend/Product';
import Payment from './Component/Frontend/Payment';
import PaymentDetail from './Component/Frontend/PaymentDetail';
import HistoryOrder from './Component/Frontend/Order';
import Product from './Component/Backend/Product';
import Order from './Component/Backend/Order';
import Customer from './Component/Frontend/Customer';
import User from './Component/Backend/User';
import Maintenance from './Component/Maintenance';
import Error from './Component/Error';
import { AuthProvider } from './Component/Layout/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <TopBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/Payment' element={<Payment />} />
            <Route path='/PaymentDetail' element={<PaymentDetail />} />
            <Route path='/HistoryOrder' element={<HistoryOrder />} />
            <Route path='/Product' element={<Product />} />
            <Route path='/Order' element={<Order />} />
            <Route path='/Customer' element={<Customer />} />
            <Route path='/User' element={<User />} />
            <Route path='/Maintenance' element={<Maintenance />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
