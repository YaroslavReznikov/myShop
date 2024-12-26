export const getUserName = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return Promise.reject('No token found');
    }

    return fetch('/getUserName', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            return data.username;
        } else {
            throw new Error(data.message);
        }
    });
};