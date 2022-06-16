# devcamp-final-project

letsgovocab Vocabulary Study Tool - Final Project for Bottega University Part Time Full Stack Development Course

Application Description

  letsgovocab is a simple, flashcard based study system designed to be used for studying other languages. As a teacher, I developed this program with my students in mind. I created this app to give them an opportunity to use their school provided iPads to have a site they can go to, register and study the words assigned to them by their teacher. It utilizes three roles (student, instructor and administrator) to achieve this purpose. Students are directed to a page where they can study all the words assigned by their teacher, or they can focus on particular sets of flashcards designated by their "set name". Teachers have full CRUD functionality over any sets they create. Administrators have the ability to see which students and teachers are in each class and reassign them as necessary. They have the ability to change any of this information at will including assigning them to a different class, promoting to instructor or administration roles. 

Utilized Technologies

  letsgovocab is developed using ReactJS, HTML, SCSS, Python and the MongoDB Atlas cloud based database. It is a SPA (single page application) using the Python Flask module for the API. Flask then uses JWT web authentication with tokens stored in the session storage after authentication during login. The Werkzeug module is used to hash and match the passwords using 256 bit encryption. The PyMongo and BSON modules are used to communicate with MongoDB Atlas using configure variables (config vars) when running through Heroku or the load_dotenv() with find_dotenv() as an argument when running locally using a .env file in order to keep the MongoDB URI and Secret Key from being accessible to the public. 

  Upon registration, dependent on their selection as a student or an instructor, their MongoDB Atlas document will be created and stored in the database with key:value pairs in JSON (BSON/cursor object) format for access later in the program.

  Media queries are utilized to some degree, but as this application is designed specifically for iPads and computers, styling will break down on phones or smaller sized screens. Future updates plan to improve this as well as configure for various phone sizes.

Known Issues

  As mentioned, this app is a work in progress. While it should meet the requirements for Bottega's Full Stack course as a final project, there are plans to develop this app further. As such, there may be lines of commented code that were purposefully left in for future development. 