import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './Products';
import Login from 'pages/Login';
import Register from 'pages/Register';
import Opinions from 'pages/opinions/Opinions';
import Order from 'pages/order/Order';
import ThankYouPage from 'pages/ThankYouPage';
import UserPanel from 'pages/userPanel/UserPanel';
import MyDetails from 'pages/userPanel/MyDetails';
import History from 'pages/userPanel/History';
import ChangePassword from 'pages/userPanel/ChangePassword';
import Newsletter from 'pages/userPanel/Newsletter/Newsletter';
import RemoveAccount from 'pages/userPanel/RemoveAccount';
import Avatars from 'pages/userPanel/Avatars/Avatars.jsx';
import NotFound from 'pages/NotFound';

const AppRouter = () => (
  <div className="main">
    <Routes>
      <Route path="/" element={<Products arePromoted />} />
      <Route path="/products" element={<Products />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/opinions" element={<Opinions />} />
      <Route path="/order" element={<Order />} />
      <Route path="/thank-you-page" element={<ThankYouPage />} />
      <Route path="/user-panel" element={<UserPanel />}>
        <Route path="" element={<MyDetails />} />
        <Route path="data" element={<MyDetails />} />
        <Route path="history" element={<History />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="remove-account" element={<RemoveAccount />} />
        <Route path="avatars" element={<Avatars />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

export default AppRouter;
