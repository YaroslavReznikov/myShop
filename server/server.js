const init = require('./init.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const cors = require('cors');
const Cookie = require('cookie');
const formidable = require('formidable');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const emailValidator = require('deep-email-validator');

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
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT HashedPassword, UserID, Username, Email FROM User WHERE Email = ?', [email], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(401).json('Unauthorized'); // No user found
            return;
        }

        const hashedPasswordFromDatabase = results[0].HashedPassword;
        const ID = results[0].UserID;
        const username = results[0].Username;
        const email = results[0].Email;
        bcrypt.compare(password, hashedPasswordFromDatabase, (err, isMatch) => {
            if (err) {
                console.error(err);
                res.status(500).json('Internal Server Error');
                return;
            }

            if (isMatch) {
                
                res.cookie("userID", ID);
                res.cookie("username", username);
                res.cookie("useremail", email);
                res.json({ message: 'Login successful', success: true });
                return;
            } else {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
        });
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
      cb(null, init.fileSave); // specify the folder where files will be saved
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // save the file with its original name
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

app.listen(5000, () =>{
    console.log("server is running on port 5000")
})