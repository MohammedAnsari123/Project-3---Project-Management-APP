import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7]">
            <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-sm border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[#0052CC] mb-2">Bug Tracker</h1>
                    <h2 className="text-base font-semibold text-[#5E6C84]">Log in to your account</h2>
                </div>

                {error && <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded border border-red-200">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:border-[#4C9AFF] transition-colors"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:border-[#4C9AFF] transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-[#0052CC] rounded-[3px] hover:bg-[#0065FF] transition-colors focus:outline-none"
                    >
                        Log in
                    </button>
                </form>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 mx-2 text-xs font-bold text-gray-500 uppercase">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <a
                    href="http://localhost:5000/api/auth/google"
                    className="flex items-center justify-center w-full px-4 py-2 mb-4 font-bold text-[#42526E] bg-white border border-gray-300 rounded-[3px] hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4 mr-2" />
                    Google
                </a>

                <div className="mt-4 text-center">
                    <Link to="/register" className="text-sm text-[#0052CC] hover:underline">
                        Sign up for an account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
