import { useState, useEffect } from 'react';
import axios from 'axios';

const INITIAL_STATE = { id: null, name: '', email: '' }; 

const getStyles = (isEditing) => ({
    container: { 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif', 
        maxWidth: '1000px', 
        padding: '20px', 
        backgroundColor: '#fff', 
        color: '#000'
    },
    input: { 
        padding: '10px', 
        border: '1px solid #ced4da', 
        borderRadius: '3px', 
        flexGrow: 1, 
        fontSize: '16px',
        backgroundColor: '#fff', 
        color: '#000'
    },
    
    form: { display: 'flex', gap: '10px', padding: '15px 0', flexWrap: 'wrap', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' },
    buttonBase: { padding: '10px 15px', color: 'white', border: 'none', borderRadius: '3px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' },
    submitButton: { backgroundColor: isEditing ? '#ff8c00' : '#28a745' },
    cancelButton: { backgroundColor: '#6c757d' },
    editButton: { backgroundColor: '#007bff', fontSize: '13px', padding: '7px 10px', marginRight: '5px' },
    deleteButton: { backgroundColor: '#dc3545', fontSize: '13px', padding: '7px 10px' },
    header: { borderBottom: '1px solid #ccc', paddingBottom: '5px', fontSize: '1.4em' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '1px solid #dee2e6', marginTop: '15px' },
    th: { padding: '12px', border: '1px solid #dee2e6', backgroundColor: '#e9ecef', fontWeight: 'bold', color: '#000' },
    td: { padding: '12px', border: '1px solid #dee2e6', color: '#000' },
    noRecords: { marginTop: '20px', color: '#dc3545', fontWeight: 'bold' }
});


export default function Home() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(INITIAL_STATE);
    const [isEditing, setIsEditing] = useState(false);
    const styles = getStyles(isEditing);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users'); 
            setUsers(response.data); 
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email } = form;
        try {
            if (isEditing) {
                await axios.put(`/api/users/${form.id}`, { name, email });
            } else {
                await axios.post('/api/users', { name, email });
            }
            setForm(INITIAL_STATE);
            setIsEditing(false);
            fetchUsers();
            alert(isEditing ? 'User updated successfully!' : 'User added successfully!');
        } catch (error) {
            alert('Error: ' + (error.response?.data?.message || 'Failed to submit user.'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/api/users/${id}`);
            fetchUsers();
            alert('User deleted successfully!');
        } catch (error) {
            alert('Error deleting user.');
        }
    };
    
    const handleEdit = (user) => {
        setForm(user);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setForm(INITIAL_STATE);
        setIsEditing(false);
    };

    return (
        <div style={styles.container}>
            
            <h2 style={{...styles.header, marginTop: '30px'}}>
                {isEditing ? `✏️ EDITING USER ID: ${form.id}` : 'Add New User'}
            </h2>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <input style={styles.input} type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input style={styles.input} type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

                <button 
                    type="submit" 
                    style={{ ...styles.buttonBase, ...styles.submitButton }}>
                    {isEditing ? 'UPDATE USER' : 'ADD USER'}
                </button>
                {isEditing && (
                    <button type="button" onClick={handleCancelEdit} style={{...styles.buttonBase, ...styles.cancelButton}}>
                        CANCEL
                    </button>
                )}
            </form>
            
            <div style={{ height: '20px' }}></div>

            <h2 style={styles.header}>
                User List ({users.length})
            </h2>

            <table style={styles.table}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>NAME</th>
                        <th style={styles.th}>EMAIL</th>
                        <th style={styles.th}>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => ( 
                        <tr key={user.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                            <td style={styles.td}>{user.id}</td>
                            <td style={styles.td}>{user.name}</td>
                            <td style={styles.td}>{user.email}</td>
                            <td style={styles.td}>
                                <button onClick={() => handleEdit(user)} style={{...styles.buttonBase, ...styles.editButton}}>Edit</button>
                                <button onClick={() => handleDelete(user.id)} style={{...styles.buttonBase, ...styles.deleteButton}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.length === 0 && <p style={styles.noRecords}>NO RECORDS FOUND. Add one above.</p>}
        </div>
    );
}