import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <AuthForm isLogin={true} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;