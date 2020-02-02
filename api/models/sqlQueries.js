/* eslint-disable indent */
const getUserByEmail = 'SELECT * FROM users WHERE email=$1';
const getUserByName = 'SELECT * FROM users WHERE userName=$1';
const getUserByPhone = 'SELECT * FROM users WHERE phone=$1';
const insertUser = `INSERT INTO
users(email, userName, phone, password)
VALUES($1, $2, $3, $4)
returning *`;
const getUser = 'SELECT * FROM users WHERE email=$1 OR userName=$1 or phone=$1';
const getUsers = 'SELECT * FROM users';
const getUserById = 'SELECT * FROM users WHERE id=$1';

export {
    getUserByEmail,
    getUserByName,
    getUserByPhone,
    insertUser,
    getUser,
    getUsers,
    getUserById,
};
