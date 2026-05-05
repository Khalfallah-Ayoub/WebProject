const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

const programmingLanguages = {
  C: {
    name: "C Programming",
    questions: [
      { title: "What is the output of: printf(\"%d\", 5 + 3);", type: "SCQ", answers: [{ text: "8", isCorrect: true }, { text: "53", isCorrect: false }, { text: "Error", isCorrect: false }] },
      { title: "Which of the following is the correct way to declare a pointer in C?", type: "MCQ", answers: [{ text: "int *ptr;", isCorrect: true }, { text: "*int ptr;", isCorrect: false }, { text: "int* ptr;", isCorrect: true }, { text: "ptr int*;", isCorrect: false }] },
      { title: "What is the size of int data type in C (typically)?", type: "SCQ", answers: [{ text: "2 bytes", isCorrect: false }, { text: "4 bytes", isCorrect: true }, { text: "8 bytes", isCorrect: false }] },
      { title: "Which header file is needed for input-output functions?", type: "SCQ", answers: [{ text: "<stdio.h>", isCorrect: true }, { text: "<stdlib.h>", isCorrect: false }, { text: "<string.h>", isCorrect: false }] },
      { title: "What does malloc() do?", type: "SCQ", answers: [{ text: "Allocates memory dynamically", isCorrect: true }, { text: "Frees memory", isCorrect: false }, { text: "Copies memory", isCorrect: false }] },
      { title: "Arrays in C are passed to functions by reference", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What is the correct syntax for defining a structure?", type: "MCQ", answers: [{ text: "struct name { };", isCorrect: true }, { text: "structure name { };", isCorrect: false }, { text: "struct { name };", isCorrect: false }, { text: "define struct name { };", isCorrect: false }] },
      { title: "NULL pointer in C points to:", type: "SCQ", answers: [{ text: "No address (invalid memory)", isCorrect: true }, { text: "Address 0", isCorrect: false }, { text: "The first address", isCorrect: false }] },
      { title: "What is the output of: int x = 5; printf(\"%d\", x++);", type: "SCQ", answers: [{ text: "5", isCorrect: true }, { text: "6", isCorrect: false }, { text: "Undefined", isCorrect: false }] },
      { title: "Which loop will execute at least once?", type: "SCQ", answers: [{ text: "do-while loop", isCorrect: true }, { text: "while loop", isCorrect: false }, { text: "for loop", isCorrect: false }] },
      { title: "String in C is terminated with:", type: "SCQ", answers: [{ text: "'\\0' (null character)", isCorrect: true }, { text: "'\\n' (newline)", isCorrect: false }, { text: "' ' (space)", isCorrect: false }] },
    ]
  },
  "C++": {
    name: "C++ Programming",
    questions: [
      { title: "Which is NOT an OOP concept?", type: "SCQ", answers: [{ text: "Goto", isCorrect: true }, { text: "Inheritance", isCorrect: false }, { text: "Polymorphism", isCorrect: false }] },
      { title: "What is the correct syntax for including a library?", type: "MCQ", answers: [{ text: "#include <iostream>", isCorrect: true }, { text: "#include iostream", isCorrect: false }, { text: "include <iostream>", isCorrect: false }] },
      { title: "Which keyword is used for inheritance in C++?", type: "SCQ", answers: [{ text: ":", isCorrect: true }, { text: "->", isCorrect: false }, { text: ".", isCorrect: false }] },
      { title: "What is a virtual function?", type: "SCQ", answers: [{ text: "A function that can be overridden in derived class", isCorrect: true }, { text: "A function that doesn't exist", isCorrect: false }, { text: "A function in memory", isCorrect: false }] },
      { title: "What is the difference between struct and class in C++?", type: "SCQ", answers: [{ text: "struct is public by default, class is private", isCorrect: true }, { text: "No difference", isCorrect: false }, { text: "class is public, struct is private", isCorrect: false }] },
      { title: "Which STL container is the fastest for random access?", type: "SCQ", answers: [{ text: "vector", isCorrect: true }, { text: "list", isCorrect: false }, { text: "queue", isCorrect: false }] },
      { title: "What does 'const' keyword do?", type: "MCQ", answers: [{ text: "Makes a variable constant", isCorrect: true }, { text: "Makes a variable mutable", isCorrect: false }, { text: "Declares a function constant", isCorrect: true }] },
      { title: "What is namespacing used for?", type: "SCQ", answers: [{ text: "To avoid name conflicts", isCorrect: true }, { text: "To optimize code", isCorrect: false }, { text: "To allocate memory", isCorrect: false }] },
      { title: "What is the output of cout << 5 << 3;", type: "SCQ", answers: [{ text: "53", isCorrect: true }, { text: "8", isCorrect: false }, { text: "Error", isCorrect: false }] },
      { title: "Exception handling uses which keywords?", type: "MCQ", answers: [{ text: "try", isCorrect: true }, { text: "catch", isCorrect: true }, { text: "throw", isCorrect: true }, { text: "finally", isCorrect: false }] },
      { title: "What is a template in C++?", type: "SCQ", answers: [{ text: "Generic programming mechanism", isCorrect: true }, { text: "A class declaration", isCorrect: false }, { text: "A function definition", isCorrect: false }] },
    ]
  },
  Java: {
    name: "Java Programming",
    questions: [
      { title: "Java is compiled to which format?", type: "SCQ", answers: [{ text: "Bytecode", isCorrect: true }, { text: "Native code", isCorrect: false }, { text: "Assembly code", isCorrect: false }] },
      { title: "Which method is the entry point of a Java program?", type: "SCQ", answers: [{ text: "public static void main(String[] args)", isCorrect: true }, { text: "public void start()", isCorrect: false }, { text: "public static void run()", isCorrect: false }] },
      { title: "Java is a platform-independent language", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What does JVM stand for?", type: "SCQ", answers: [{ text: "Java Virtual Machine", isCorrect: true }, { text: "Java Version Manager", isCorrect: false }, { text: "Java Validation Module", isCorrect: false }] },
      { title: "Which package contains basic Java classes?", type: "SCQ", answers: [{ text: "java.lang", isCorrect: true }, { text: "java.util", isCorrect: false }, { text: "java.io", isCorrect: false }] },
      { title: "What is the access modifier for public members?", type: "SCQ", answers: [{ text: "Accessible everywhere", isCorrect: true }, { text: "Accessible only in same class", isCorrect: false }, { text: "Accessible only in same package", isCorrect: false }] },
      { title: "Which interface is used for threading?", type: "SCQ", answers: [{ text: "Runnable", isCorrect: true }, { text: "Thread", isCorrect: false }, { text: "Callable", isCorrect: false }] },
      { title: "What is the default value of a boolean variable in Java?", type: "SCQ", answers: [{ text: "false", isCorrect: true }, { text: "true", isCorrect: false }, { text: "null", isCorrect: false }] },
      { title: "ArrayList is a generic collection", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "Which keyword is used for method overriding annotation?", type: "SCQ", answers: [{ text: "@Override", isCorrect: true }, { text: "@Override()", isCorrect: false }, { text: "@override", isCorrect: false }] },
      { title: "String is immutable in Java", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
    ]
  },
  JavaScript: {
    name: "JavaScript Programming",
    questions: [
      { title: "JavaScript is dynamically typed", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What keyword declares a variable with block scope?", type: "SCQ", answers: [{ text: "let", isCorrect: true }, { text: "var", isCorrect: false }, { text: "const", isCorrect: false }] },
      { title: "Which method adds an element to the end of an array?", type: "SCQ", answers: [{ text: "push()", isCorrect: true }, { text: "pop()", isCorrect: false }, { text: "shift()", isCorrect: false }] },
      { title: "What does === check in JavaScript?", type: "SCQ", answers: [{ text: "Value and type equality", isCorrect: true }, { text: "Only value equality", isCorrect: false }, { text: "Object reference", isCorrect: false }] },
      { title: "Promises are used for handling asynchronous code", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What is a closure in JavaScript?", type: "SCQ", answers: [{ text: "A function with access to outer scope", isCorrect: true }, { text: "A closed loop", isCorrect: false }, { text: "A data structure", isCorrect: false }] },
      { title: "Which statement creates an object?", type: "MCQ", answers: [{ text: "new Object()", isCorrect: true }, { text: "{ }", isCorrect: true }, { text: "new Array()", isCorrect: false }] },
      { title: "What is the output of: typeof null", type: "SCQ", answers: [{ text: "object", isCorrect: true }, { text: "null", isCorrect: false }, { text: "undefined", isCorrect: false }] },
      { title: "Arrow functions use 'this' binding differently", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "Which method converts a string to uppercase?", type: "SCQ", answers: [{ text: "toUpperCase()", isCorrect: true }, { text: "upper()", isCorrect: false }, { text: "uppercase()", isCorrect: false }] },
      { title: "Async/await provides syntactic sugar over promises", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
    ]
  },
  Python: {
    name: "Python Programming",
    questions: [
      { title: "Python is an interpreted language", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What is the output of: print(type([]))", type: "SCQ", answers: [{ text: "<class 'list'>", isCorrect: true }, { text: "<class 'array'>", isCorrect: false }, { text: "List", isCorrect: false }] },
      { title: "How do you create a dictionary in Python?", type: "MCQ", answers: [{ text: "d = {}", isCorrect: true }, { text: "d = dict()", isCorrect: true }, { text: "d = []", isCorrect: false }] },
      { title: "What keyword is used to create a function?", type: "SCQ", answers: [{ text: "def", isCorrect: true }, { text: "func", isCorrect: false }, { text: "function", isCorrect: false }] },
      { title: "Python uses indentation for code blocks", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What does list slicing use?", type: "SCQ", answers: [{ text: "Colon (:)", isCorrect: true }, { text: "Comma (,)", isCorrect: false }, { text: "Pipe (|)", isCorrect: false }] },
      { title: "Which method removes and returns last list element?", type: "SCQ", answers: [{ text: "pop()", isCorrect: true }, { text: "remove()", isCorrect: false }, { text: "delete()", isCorrect: false }] },
      { title: "What is a lambda function?", type: "SCQ", answers: [{ text: "An anonymous inline function", isCorrect: true }, { text: "A loop function", isCorrect: false }, { text: "A class", isCorrect: false }] },
      { title: "Python supports multiple inheritance", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "Which statement is used for exception handling?", type: "MCQ", answers: [{ text: "try", isCorrect: true }, { text: "except", isCorrect: true }, { text: "finally", isCorrect: true }, { text: "catch", isCorrect: false }] },
      { title: "What is the output of: len('Python')", type: "SCQ", answers: [{ text: "6", isCorrect: true }, { text: "5", isCorrect: false }, { text: "7", isCorrect: false }] },
    ]
  },
  "C#": {
    name: "C# Programming",
    questions: [
      { title: "C# is a managed language running on .NET", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "Which is the access modifier for public?", type: "SCQ", answers: [{ text: "public", isCorrect: true }, { text: "public:", isCorrect: false }, { text: "@public", isCorrect: false }] },
      { title: "What is LINQ used for?", type: "SCQ", answers: [{ text: "Querying data collections", isCorrect: true }, { text: "Linking libraries", isCorrect: false }, { text: "Line numbering", isCorrect: false }] },
      { title: "C# supports properties similar to Java getters/setters", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What is the base class for all classes in C#?", type: "SCQ", answers: [{ text: "object", isCorrect: true }, { text: "Object", isCorrect: false }, { text: "System", isCorrect: false }] },
      { title: "Which keyword makes a method virtual?", type: "SCQ", answers: [{ text: "virtual", isCorrect: true }, { text: "override", isCorrect: false }, { text: "abstract", isCorrect: false }] },
      { title: "Async/await is supported in C#", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What is a delegate in C#?", type: "SCQ", answers: [{ text: "Type-safe function pointer", isCorrect: true }, { text: "A class", isCorrect: false }, { text: "An interface", isCorrect: false }] },
      { title: "C# has nullable types like int?", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "Extension methods in C# use which keyword?", type: "SCQ", answers: [{ text: "this", isCorrect: true }, { text: "extend", isCorrect: false }, { text: "static", isCorrect: false }] },
      { title: "Pattern matching is a C# feature", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
    ]
  },
  PHP: {
    name: "PHP Programming",
    questions: [
      { title: "PHP code is executed on the server side", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What is the correct syntax to start PHP?", type: "SCQ", answers: [{ text: "<?php", isCorrect: true }, { text: "<php>", isCorrect: false }, { text: "<?>", isCorrect: false }] },
      { title: "Which function outputs text in PHP?", type: "MCQ", answers: [{ text: "echo", isCorrect: true }, { text: "print", isCorrect: true }, { text: "output", isCorrect: false }] },
      { title: "PHP variables start with which symbol?", type: "SCQ", answers: [{ text: "$", isCorrect: true }, { text: "@", isCorrect: false }, { text: "#", isCorrect: false }] },
      { title: "What is the output of: echo 5 + 3;", type: "SCQ", answers: [{ text: "8", isCorrect: true }, { text: "53", isCorrect: false }, { text: "Error", isCorrect: false }] },
      { title: "Which superglobal contains form data from GET/POST?", type: "MCQ", answers: [{ text: "$_GET", isCorrect: true }, { text: "$_POST", isCorrect: true }, { text: "$_REQUEST", isCorrect: true }] },
      { title: "How do you connect to a database in PHP?", type: "SCQ", answers: [{ text: "mysqli_connect() or PDO", isCorrect: true }, { text: "db_connect()", isCorrect: false }, { text: "sql_connect()", isCorrect: false }] },
      { title: "What is a session in PHP?", type: "SCQ", answers: [{ text: "Persistent data for a user", isCorrect: true }, { text: "A single page load", isCorrect: false }, { text: "A database connection", isCorrect: false }] },
      { title: "Prepared statements prevent SQL injection", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What is the output of: var_dump(true);", type: "SCQ", answers: [{ text: "bool(true)", isCorrect: true }, { text: "true", isCorrect: false }, { text: "1", isCorrect: false }] },
      { title: "PHP is a loosely typed language", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
    ]
  }
};

const seedDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Run migrations first - with error handling
    console.log("[*] Running migrations...");
    try {
      const migrationFile = path.join(__dirname, "../migrations/003_add_exam_sets.sql");
      if (fs.existsSync(migrationFile)) {
        const migrationSQL = fs.readFileSync(migrationFile, "utf-8");
        await client.query(migrationSQL);
        console.log("[✓] Migrations completed");
      }
    } catch (migrationError) {
      console.log("[!] Migration error (continuing):", migrationError.message);
      // Try creating tables with simpler SQL if migration fails
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS exam_sets (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
            difficulty VARCHAR(20) DEFAULT 'beginner',
            description TEXT,
            created_at TIMESTAMP DEFAULT NOW()
          )
        `);
        await client.query(`
          CREATE TABLE IF NOT EXISTS exam_set_questions (
            exam_set_id INTEGER REFERENCES exam_sets(id) ON DELETE CASCADE,
            question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
            PRIMARY KEY(exam_set_id, question_id)
          )
        `);
        console.log("[✓] Tables created with simplified schema");
      } catch (tableError) {
        console.log("[!] Could not create tables:", tableError.message);
      }
    }

    // Clear existing data
    console.log("[*] Deleting existing data...");
    await client.query("DELETE FROM user_answers");
    await client.query("DELETE FROM session_questions");
    await client.query("DELETE FROM quiz_sessions");
    await client.query("DELETE FROM answers");
    await client.query("DELETE FROM questions");
    await client.query("DELETE FROM categories");

    let totalQuestions = 0;
    // Create categories and questions
    for (const [langKey, langData] of Object.entries(programmingLanguages)) {
      console.log(`[+] Adding category: ${langData.name}`);

      const categoryResult = await client.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        [langData.name]
      );
      const categoryId = categoryResult.rows[0].id;

      // Add questions for this category
      for (const question of langData.questions) {
        const questionResult = await client.query(
          "INSERT INTO questions (title, type, category_id) VALUES ($1, $2, $3) RETURNING id",
          [question.title, question.type, categoryId]
        );
        const questionId = questionResult.rows[0].id;

        // Add answers for this question
        for (const answer of question.answers) {
          await client.query(
            "INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3)",
            [questionId, answer.text, answer.isCorrect]
          );
        }
        totalQuestions++;
      }
    }

    await client.query("COMMIT");
    return {
      success: true,
      message: "Database seeded successfully!",
      categories: 7,
      totalQuestions: totalQuestions
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { seedDatabase };
