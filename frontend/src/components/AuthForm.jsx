import React from "react";

const AuthForm = ({ title, fields, onSubmit, buttonLabel }) => {
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map(({ label, type, value, onChange }, idx) => (
          <div key={idx}>
            <label className="block mb-1">{label}</label>
            <input
              type={type}
              value={value}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;