const init = require('./init.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const cors = require('cors');
const Cookies = require('universal-cookie');
const formidable = require('formidable');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const emailValidator = require('deep-email-validator');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const app = express();
app.get('/api', (req, res) => {
    res.json({"users": "firstOne"});
})
var connection = mysql.createConnection({
  host: init.host,
  user: init.user,
  password: init.password, 
  database: init.database
});
connection.connect(err => {
    if(err) {
        console.error('Error connecting to the database:', err.stack);
        process.exit(1); // Exit the process if there's a database connection error
    }
    console.log('Connected to the database.');
});
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use(express.static(path.join(__dirname)));

async function isEmailValid(email) {
    return emailValidator.validate(email)
  }
app.post('/loginWithoutToken', (req, res) => {
    const { email, password, rememberMe } = req.body;

    // Query to get user details based on email
    connection.query('SELECT HashedPassword, UserID, Username FROM User WHERE Email = ?', [email], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(401).json({ message: 'Unauthorized: No user found' });
        }

        const hashedPasswordFromDatabase = results[0].HashedPassword;

        // Compare provided password with stored hashed password
        bcrypt.compare(password, hashedPasswordFromDatabase, (err, isMatch) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (isMatch) {
                const expiresIn = rememberMe ? '7d' : '1h';
                const token = jwt.sign(
                    { userID: results[0].UserID, username: results[0].Username },
                    "1", 
                    { expiresIn: expiresIn } // Token expiration
                );

                res.json({ message: 'Login successful', success: true, token });
            } else {
                res.status(401).json({ message: 'Unauthorized: Incorrect password' });
            }
        });
    });
});
app.post('/loginWithToken', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token after "Bearer "
    jwt.verify(token, "1", (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }

        res.json({ success: true, message: 'Access granted', user: decoded });
    });
});
app.post("/signUp", async  (req, res) => {
    const { username, email, password } = req.body;
    const isValidEmail = await isEmailValid(email);
    if (!isValidEmail.valid) {
        return res.status(400).json({ message: "Email is invalid" });
    }

    connection.query("SELECT UserID FROM User WHERE Email = ?", [email], (err, result) => {
        if (err) {
            console.log(1);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (result.length != 0) {
            return res.status(400).json({ message: "This email is already used" });
        }

        connection.query("SELECT UserID FROM User WHERE Username = ?", [username], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Internal server error" });
            }
            if (result.length != 0) {
                return res.status(400).json({ message: "This username is already used" });
            }

            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) {
                    console.error(err);
                    console.log(3);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                connection.query("INSERT INTO User(Username, Email, HashedPassword) VALUES(?, ?, ?)", [username, email, hash], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Database error' });
                    }
                    res.json({ success: true });
                });
            });
        });
    });
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, init.fileSave); 
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
const upload = multer({ storage: storage });
app.post("/addGood", upload.single('picture'), (req, res) => {
    const productName = req.body.goodName;
    const description = req.body.description;
    const goodPrice = req.body.price;
    const userId = req.cookies.userID;

    if (!req.file) {
        return res.status(400).json({ message: 'File upload failed' });
    }

    const pictureLocation = req.file.path;

    connection.query(
        "INSERT INTO Product (UserID, ProductName, Description, Price) VALUES (?, ?, ?, ?)",
        [userId, productName, description, goodPrice],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Database error' });
            }

            const productId = results.insertId;  // Getting the product ID from the INSERT query result

            connection.query(
                "INSERT INTO ProductPicture (ProductID, PicturePath) VALUES (?, ?)",
                [productId, pictureLocation],
                (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Database error' });
                    }

                    res.json({ success: true });
                }
            );
        }
    );
});
app.get("/getDatabase", (req, res) => {
    connection.query("SELECT * FROM Product", (error, results) => {  // Corrected table name
        if (error) {
            console.error(error);
            return res.status(500).json('Internal Server Error');
        }
        
        res.json(results);
    });
});
app.get("/getUserName", (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    jwt.verify(token, "1", (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
        const username = decoded.username;
        return res.json({ success: true, username: username });
    });
});
app.listen(5000, () =>{
    console.log("server is running on port 5000")
})