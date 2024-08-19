import axios from 'axios';
import React, { useState } from 'react';
import './createConnector.css';

const CreateConnector: React.FC<{ id: string }> = ({ id }) => {
    const [hasError, setHasError] = useState<Error | null>(null);
    const [name, setName] = useState('');
    const [databaseName, setDatabaseName] = useState('');
    const [status, setStatus] = useState('');
    const [checkCreate, setCheckCreate] = useState(false);
    const [userId, setUserId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setUserId(id);

        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('database', databaseName);
        formData.append('status', status);
        formData.append('id', id);

        try {
            if (formData.get('name') === '' || formData.get('databaseName') === '' || formData.get('status') === '') {
                setHasError(new Error('Не все поля заполнены'));
            } else {
                const response = await axios.post('http://localhost:8080/api/connectors/create', formData);
                setCheckCreate(response.data);
            }
        } catch (err) {
            console.log(err);
            setHasError(new Error(String(err)));
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Database:
                    <input type="text" value={databaseName} onChange={(e) => setDatabaseName(e.target.value)} />
                </label>
                <label>
                    Status:
                    <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
                </label>
                <button type="submit">Create Connector</button>
            </form>
            {hasError && <p style={{ color: 'red' }}>{hasError.message}</p>}
            {checkCreate && <p>Connector created successfully!</p>}
        </div>
    );
};

export default CreateConnector;