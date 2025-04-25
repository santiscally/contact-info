import React from 'react';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <AuthForm isLogin={false} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;