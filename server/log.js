
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'logInPage.html'));
});
app.get('/signUp', (req, res) => {
    console.log('GET /signUp triggered');
    res.send('Signup page');
});
async function isEmailValid(email) {
    return emailValidator.validate(email)
  }
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT hashedPassword, ID, username, mail FROM registration WHERE mail = ?', [email], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(401).json('Unauthorized'); // No user found
            return;
        }

        const hashedPasswordFromDatabase = results[0].hashedPassword;
        const ID = results[0].ID;
        const username = results[0].username;
        const email = results[0].mail;
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
    const { username, email, password, passwordCopy } = req.body;

    if (password !== passwordCopy) {
        return res.status(400).json({ message: 'Passwords are not same' });
    }
    
    const isValidEmail = await isEmailValid(email);
    if (!isValidEmail.valid) {
        return res.status(400).json({ message: "Email is invalid" });
    }

    connection.query("SELECT ID FROM registration WHERE mail = ?", [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (result.length != 0) {
            return res.status(400).json({ message: "This email is already used" });
        }

        connection.query("SELECT ID FROM registration WHERE username = ?", [username], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            if (result.length != 0) {
                return res.status(400).json({ message: "This username is already used" });
            }

            bcrypt.hash(password, saltRounds, function(err, hash) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                connection.query("INSERT INTO registration(username, mail, hashedPassword, registrationDateTime) VALUES(?, ?, ?, NOW())", [username, email, hash], (err, results) => {
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
    const goodName = req.body.goodName;
    const description = req.body.description;
    const goodPrice = req.body.price;
    const userId = req.cookies.userID;
    if (!req.file) {
        return res.status(400).json({ message: 'File upload failed' });
    }

    const pictureLocation = req.file.path;

    connection.query(
        "INSERT INTO shopGoods (userID, pictureLocation, goodName, description, price) VALUES (?, ?, ?, ?, ?)",
        [userId, pictureLocation, goodName, description, goodPrice],
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.json({ success: true });
        }
    );
});
app.get("/getDatabase", (req, res) => {
    connection.query("SELECT * FROM shopGoods", (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json('Internal Server Error');
        }
        
        res.json(results);
    });
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});