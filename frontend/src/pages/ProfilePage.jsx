import { useState, useEffect } from 'react';
import api from '../services/api';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/profile');
        setUser(response.data);
        setFormData({
          email: response.data.email,
          password: '', 
        });
      } catch (error) {
        setError('Error fetching user data.');
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', formData); // Adjust endpoint if necessary
      setUser({ ...user, ...formData });
      setEditable(false);
      setError('');
    } catch (error) {
      setError('Error updating profile.');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user ? (
        <div>
          <h2>User Profile</h2>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editable}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={!editable}
              />
            </div>
            <button type="button" onClick={() => setEditable(!editable)}>
              {editable ? 'Cancel' : 'Edit'}
            </button>
            {editable && <button type="submit">Save Changes</button>}
          </form>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default ProfilePage;
