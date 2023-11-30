// const express = require('express');
// const mysql = require('mysql');
// const bcrypt = require('bcryptjs');


// const port = process.env.port || 3000;
// const app = express();

// app.use(express.json());
// const cors = require('cors');

// app.use(cors());


// var connection = mysql.createConnection({
//     host : 'sql5.freemysqlhosting.net',
//     user : 'sql5665931',
//     password : 'g61Lfyi92G',
//     database : 'sql5665931'
// });

// function encryptPassword(password) {  //function to encrypt the password
//     const saltRounds = 10;
//     try {
//         const hashedPassword = bcrypt.hashSync(password, saltRounds);
//         return hashedPassword;
//     } catch (error) {
//         throw error;
//     }
// }

// app.post('/signup', async (req,res)=>{
//     const {username, password} = req.body;
//     const pwd = encryptPassword(password);

//     connection.connect();

//     connection.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, pwd], function (error, results, fields){
//         connection.end();
//         if(error) throw error;
//         res.json({success: true});
//     });
// });

// function comparePasswords(inputPassword, hashedPassword) {
//     return bcrypt.compareSync(inputPassword, hashedPassword);
// }

// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     connection.connect();

//     connection.query('SELECT password FROM Users WHERE username = ?', [username], function (error, results, fields) {
//         if (error) {
//             connection.end();
//             throw error;
//         }

//         if (results.length === 0) {
//             connection.end();
//             return res.status(401).json({ success: false, message: 'Username not found' });
//         }

//         const storedPassword = results[0].password;

//         if (comparePasswords(password, storedPassword)) {
//             // Passwords match, login successful
//             connection.end();
//             res.json({ success: true, message: 'Login successful' });
//         } else {
//             // Passwords do not match
//             connection.end();
//             res.status(401).json({ success: false, message: 'Invalid password' });
//         }
//     });
// });


// app.get('/getBudget/:month', (req, res) => {
//     const monthName = req.params.month;
//     const sql = 'SELECT b.* FROM Budgets b INNER JOIN Month m ON b.month_id = m.month_id WHERE m.month = ?';

//     connection.query(sql, [monthName], (error, results, fields) => {
//         if (error) {
//             res.status(500).send('Error fetching budgets');
//         } else {
//             res.json(results);
//         }
//     });
// });


// app.post('/budget', (req, res) => {
//     const { username, month, budget_criteria, amount } = req.body;

//     // Get user_id from username
//     const getUserIdSql = 'SELECT user_id FROM Users WHERE username = ?';
//     connection.query(getUserIdSql, [username], (err, userRows) => {
//         if (err || userRows.length === 0) {
//             res.status(500).send('Error fetching user');
//         } else {
//             const user_id = userRows[0].user_id;

//             // If month is specified, check if the budget already exists
//             if (month) {
//                 const getMonthIdSql = 'SELECT month_id FROM Month WHERE month = ?';
//                 connection.query(getMonthIdSql, [month], (err, monthRows) => {
//                     if (err || monthRows.length === 0) {
//                         res.status(500).send('Error fetching month');
//                     } else {
//                         const month_id = monthRows[0].month_id;

//                         const checkBudgetSql = 'SELECT * FROM Budgets WHERE month_id = ? AND user_id = ? AND budget_criteria = ?';
//                         connection.query(checkBudgetSql, [month_id, user_id, budget_criteria], (err, budgetRows) => {
//                             if (err) {
//                                 res.status(500).send('Error checking budget');
//                             } else {
//                                 if (budgetRows.length > 0) {
//                                     // Budget exists, update it
//                                     const updateBudgetSql = 'UPDATE Budgets SET amount = ? WHERE month_id = ? AND user_id = ? AND budget_criteria = ?';
//                                     connection.query(updateBudgetSql, [amount, month_id, user_id, budget_criteria], (err, result) => {
//                                         if (err) {
//                                             res.status(500).send('Error updating budget for specific month');
//                                         } else {
//                                             res.status(200).send('Budget updated for specific month successfully');
//                                         }
//                                     });
//                                 } else {
//                                     // Budget doesn't exist, insert it
//                                     const insertBudgetSql = 'INSERT INTO Budgets (month_id, user_id, budget_criteria, amount) VALUES (?, ?, ?, ?)';
//                                     connection.query(insertBudgetSql, [month_id, user_id, budget_criteria, amount], (err, result) => {
//                                         if (err) {
//                                             res.status(500).send('Error inserting budget for specific month');
//                                         } else {
//                                             res.status(200).send('Budget inserted for specific month successfully');
//                                         }
//                                     });
//                                 }
//                             }
//                         });
//                     }
//                 });
//             } else {
//                 // If month is not specified, insert into all months
//                 const getMonthsSql = 'SELECT month_id FROM Month';
//                 connection.query(getMonthsSql, (err, monthRows) => {
//                     if (err) {
//                         res.status(500).send('Error fetching months');
//                     } else {
//                         const values = monthRows.map(row => [row.month_id, user_id, budget_criteria, amount]);
//                         const insertBudgetSql = 'INSERT INTO Budgets (month_id, user_id, budget_criteria, amount) VALUES ?';
//                         connection.query(insertBudgetSql, [values], (err, result) => {
//                             if (err) {
//                                 res.status(500).send('Error inserting budget for all months');
//                             } else {
//                                 res.status(200).send('Budget inserted for all months successfully');
//                             }
//                         });
//                     }
//                 });
//             }
//         }
//     });
// });


// app.put('/expenses', (req, res) => {
//     const { username, month, budget_criteria, expense } = req.body;

//     // Get user_id from username
//     const getUserIdSql = 'SELECT user_id FROM Users WHERE username = ?';
//     connection.query(getUserIdSql, [username], (err, userRows) => {
//         if (err || userRows.length === 0) {
//             res.status(500).send('Error fetching user');
//         } else {
//             const user_id = userRows[0].user_id;

//             // Get month_id from month
//             const getMonthIdSql = 'SELECT month_id FROM Month WHERE month = ?';
//             connection.query(getMonthIdSql, [month], (err, monthRows) => {
//                 if (err || monthRows.length === 0) {
//                     res.status(500).send('Error fetching month');
//                 } else {
//                     const month_id = monthRows[0].month_id;

//                     // Get budget_criteria_id from budget_criteria
//                     const getBudgetCriteriaIdSql = 'SELECT budget_id FROM Budgets WHERE budget_criteria = ?';
//                     connection.query(getBudgetCriteriaIdSql, [budget_criteria], (err, budgetRows) => {
//                         if (err || budgetRows.length === 0) {
//                             res.status(500).send('Error fetching budget criteria');
//                         } else {
//                             const budget_criteria_id = budgetRows[0].budget_id;

//                             const selectSql = 'SELECT * FROM Expenses WHERE user_id = ? AND month_id = ? AND budget_criteria_id = ?';
//                             connection.query(selectSql, [user_id, month_id, budget_criteria_id], (err, rows) => {
//                                 if (err) {
//                                     res.status(500).send('Error fetching expenses');
//                                 } else {
//                                     if (rows.length > 0) {
//                                         // If expenses for the budget criteria exist, update the spent_amount
//                                         const currentSpentAmount = rows[0].spent_amount;
//                                         const updatedSpentAmount = currentSpentAmount + expense;

//                                         const updateSql = 'UPDATE Expenses SET spent_amount = ? WHERE user_id = ? AND month_id = ? AND budget_criteria_id = ?';
//                                         connection.query(updateSql, [updatedSpentAmount, user_id, month_id, budget_criteria_id], (err, result) => {
//                                             if (err) {
//                                                 res.status(500).send('Error updating expenses');
//                                             } else {
//                                                 res.status(200).json({
//                                                     username: username,
//                                                     month: month,
//                                                     budget_criteria: budget_criteria,
//                                                     spent_amount: updatedSpentAmount
//                                                 });
//                                             }
//                                         });
//                                     } else {
//                                         // If expenses for the budget criteria do not exist, insert a new record
//                                         const insertSql = 'INSERT INTO Expenses (user_id, month_id, budget_criteria_id, spent_amount) VALUES (?, ?, ?, ?)';
//                                         connection.query(insertSql, [user_id, month_id, budget_criteria_id, expense], (err, result) => {
//                                             if (err) {
//                                                 res.status(500).send('Error adding expenses');
//                                             } else {
//                                                 res.status(200).json({
//                                                     username: username,
//                                                     month: month,
//                                                     budget_criteria: budget_criteria,
//                                                     spent_amount: expense
//                                                 });
//                                             }
//                                         });
//                                     }
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// });


// app.listen(port, () => {
//     console.log(`Server on port ${port}`);
// });




const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.port || 3000;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'sql5.freemysqlhosting.net',
  user: 'sql5665931',
  password: 'g61Lfyi92G',
  database: 'sql5665931'
});

app.use(express.json());
const cors = require('cors');
app.use(cors());

function encryptPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}


const JWT_SECRET_KEY = 'your_secret_key_here';

// Function to generate JWT token
function generateToken(user) {
  const token = jwt.sign({ username: user.username }, JWT_SECRET_KEY, { expiresIn: '1m' }); // Token expires in 1 hour (you can adjust this)
  return token;
}

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const pwd = encryptPassword(password);

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error connecting to the database' });
    }

    connection.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, pwd], (error, results, fields) => {
      connection.release();
      if (error) {
        return res.status(500).json({ success: false, message: 'Error executing query' });
      }
      res.json({ success: true });
    });
  });
});

function comparePasswords(inputPassword, hashedPassword) {
  return bcrypt.compareSync(inputPassword, hashedPassword);
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    pool.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error connecting to the database' });
      }
  
      connection.query('SELECT password FROM Users WHERE username = ?', [username], (error, results, fields) => {
        connection.release();
        if (error) {
          return res.status(500).json({ success: false, message: 'Error executing query' });
        }
  
        if (results.length === 0) {
          return res.status(401).json({ success: false, message: 'Username not found' });
        }
  
        const storedPassword = results[0].password;
  
        if (comparePasswords(password, storedPassword)) {
          const token = generateToken({ username }); // Generate JWT token
          res.json({ success: true, message: 'Login successful', token }); // Send the token in the response
        } else {
          res.status(401).json({ success: false, message: 'Invalid password' });
        }
      });
    });
  });
  



// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   pool.getConnection((err, connection) => {
//     if (err) {
//       return res.status(500).json({ success: false, message: 'Error connecting to the database' });
//     }

//     connection.query('SELECT password FROM Users WHERE username = ?', [username], (error, results, fields) => {
//       connection.release();
//       if (error) {
//         return res.status(500).json({ success: false, message: 'Error executing query' });
//       }

//       if (results.length === 0) {
//         return res.status(401).json({ success: false, message: 'Username not found' });
//       }

//       const storedPassword = results[0].password;

//       if (comparePasswords(password, storedPassword)) {
//         res.json({ success: true, message: 'Login successful' });
//       } else {
//         res.status(401).json({ success: false, message: 'Invalid password' });
//       }
//     });
//   });
// });

app.get('/getBudget/:month', (req, res) => {
    const monthName = req.params.month;
    const sql = 'SELECT b.* FROM Budgets b INNER JOIN Month m ON b.month_id = m.month_id WHERE m.month = ?';

    connection.query(sql, [monthName], (error, results, fields) => {
        if (error) {
            res.status(500).send('Error fetching budgets');
        } else {
            res.json(results);
        }
    });
});


app.post('/budget', (req, res) => {
    const { username, month, budget_criteria, amount } = req.body;

    // Get user_id from username
    const getUserIdSql = 'SELECT user_id FROM Users WHERE username = ?';
    connection.query(getUserIdSql, [username], (err, userRows) => {
        if (err || userRows.length === 0) {
            res.status(500).send('Error fetching user');
        } else {
            const user_id = userRows[0].user_id;

            // If month is specified, check if the budget already exists
            if (month) {
                const getMonthIdSql = 'SELECT month_id FROM Month WHERE month = ?';
                connection.query(getMonthIdSql, [month], (err, monthRows) => {
                    if (err || monthRows.length === 0) {
                        res.status(500).send('Error fetching month');
                    } else {
                        const month_id = monthRows[0].month_id;

                        const checkBudgetSql = 'SELECT * FROM Budgets WHERE month_id = ? AND user_id = ? AND budget_criteria = ?';
                        connection.query(checkBudgetSql, [month_id, user_id, budget_criteria], (err, budgetRows) => {
                            if (err) {
                                res.status(500).send('Error checking budget');
                            } else {
                                if (budgetRows.length > 0) {
                                    // Budget exists, update it
                                    const updateBudgetSql = 'UPDATE Budgets SET amount = ? WHERE month_id = ? AND user_id = ? AND budget_criteria = ?';
                                    connection.query(updateBudgetSql, [amount, month_id, user_id, budget_criteria], (err, result) => {
                                        if (err) {
                                            res.status(500).send('Error updating budget for specific month');
                                        } else {
                                            res.status(200).send('Budget updated for specific month successfully');
                                        }
                                    });
                                } else {
                                    // Budget doesn't exist, insert it
                                    const insertBudgetSql = 'INSERT INTO Budgets (month_id, user_id, budget_criteria, amount) VALUES (?, ?, ?, ?)';
                                    connection.query(insertBudgetSql, [month_id, user_id, budget_criteria, amount], (err, result) => {
                                        if (err) {
                                            res.status(500).send('Error inserting budget for specific month');
                                        } else {
                                            res.status(200).send('Budget inserted for specific month successfully');
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                // If month is not specified, insert into all months
                const getMonthsSql = 'SELECT month_id FROM Month';
                connection.query(getMonthsSql, (err, monthRows) => {
                    if (err) {
                        res.status(500).send('Error fetching months');
                    } else {
                        const values = monthRows.map(row => [row.month_id, user_id, budget_criteria, amount]);
                        const insertBudgetSql = 'INSERT INTO Budgets (month_id, user_id, budget_criteria, amount) VALUES ?';
                        connection.query(insertBudgetSql, [values], (err, result) => {
                            if (err) {
                                res.status(500).send('Error inserting budget for all months');
                            } else {
                                res.status(200).send('Budget inserted for all months successfully');
                            }
                        });
                    }
                });
            }
        }
    });
});


app.put('/expenses', (req, res) => {
    const { username, month, budget_criteria, expense } = req.body;

    // Get user_id from username
    const getUserIdSql = 'SELECT user_id FROM Users WHERE username = ?';
    connection.query(getUserIdSql, [username], (err, userRows) => {
        if (err || userRows.length === 0) {
            res.status(500).send('Error fetching user');
        } else {
            const user_id = userRows[0].user_id;

            // Get month_id from month
            const getMonthIdSql = 'SELECT month_id FROM Month WHERE month = ?';
            connection.query(getMonthIdSql, [month], (err, monthRows) => {
                if (err || monthRows.length === 0) {
                    res.status(500).send('Error fetching month');
                } else {
                    const month_id = monthRows[0].month_id;

                    // Get budget_criteria_id from budget_criteria
                    const getBudgetCriteriaIdSql = 'SELECT budget_id FROM Budgets WHERE budget_criteria = ?';
                    connection.query(getBudgetCriteriaIdSql, [budget_criteria], (err, budgetRows) => {
                        if (err || budgetRows.length === 0) {
                            res.status(500).send('Error fetching budget criteria');
                        } else {
                            const budget_criteria_id = budgetRows[0].budget_id;

                            const selectSql = 'SELECT * FROM Expenses WHERE user_id = ? AND month_id = ? AND budget_criteria_id = ?';
                            connection.query(selectSql, [user_id, month_id, budget_criteria_id], (err, rows) => {
                                if (err) {
                                    res.status(500).send('Error fetching expenses');
                                } else {
                                    if (rows.length > 0) {
                                        // If expenses for the budget criteria exist, update the spent_amount
                                        const currentSpentAmount = rows[0].spent_amount;
                                        const updatedSpentAmount = currentSpentAmount + expense;

                                        const updateSql = 'UPDATE Expenses SET spent_amount = ? WHERE user_id = ? AND month_id = ? AND budget_criteria_id = ?';
                                        connection.query(updateSql, [updatedSpentAmount, user_id, month_id, budget_criteria_id], (err, result) => {
                                            if (err) {
                                                res.status(500).send('Error updating expenses');
                                            } else {
                                                res.status(200).json({
                                                    username: username,
                                                    month: month,
                                                    budget_criteria: budget_criteria,
                                                    spent_amount: updatedSpentAmount
                                                });
                                            }
                                        });
                                    } else {
                                        // If expenses for the budget criteria do not exist, insert a new record
                                        const insertSql = 'INSERT INTO Expenses (user_id, month_id, budget_criteria_id, spent_amount) VALUES (?, ?, ?, ?)';
                                        connection.query(insertSql, [user_id, month_id, budget_criteria_id, expense], (err, result) => {
                                            if (err) {
                                                res.status(500).send('Error adding expenses');
                                            } else {
                                                res.status(200).json({
                                                    username: username,
                                                    month: month,
                                                    budget_criteria: budget_criteria,
                                                    spent_amount: expense
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


app.listen(port, () => {
    console.log(`Server on port ${port}`);
});

