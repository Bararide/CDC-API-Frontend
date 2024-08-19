import React, { useState } from 'react';
import './App.css';

import axios from 'axios';
import HomePage from './home';

const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [userId, setUserId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);

        try {
            const response = await axios.post('http://localhost:8080/api/login', formData);

            if (response.status === 200) {
                setUserId(response.data.id);
                setIsAuthenticated(true);
                setHasError(false);
            } else {
                setIsAuthenticated(false);
                setHasError(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setHasError(true);
            setIsAuthenticated(false);
        }
    };

    return (
        isAuthenticated ? (
            <HomePage user_id={userId}/>
        ) : (
            <div className="home-App">
                <h2 className="home-h2">Registration Form</h2>
                {hasError && (
                    <label className="home-warning-p">
                        Введены некорректные данные
                    </label>
                )}
                <form className="home-form" onSubmit={handleSubmit}>
                    <label className="home-label">
                        Username:
                        <input className="home-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label className="home-label">
                        Email:
                        <input className="home-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label className="home-label">
                        Password:
                        <input className="home-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <button className="home-button" type="submit">Register</button>
                </form>
            </div>
        )
    );
};

export default RegistrationForm;