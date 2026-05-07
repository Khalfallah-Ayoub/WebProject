require("dotenv").config({ path: "../.env" });
const pool = require("../config/db");

const programmingLanguages = {
  C: {
    name: "C Programming",
    questions: [
      { title: "What is the output of: printf(\"%d\", 5 + 3);", type: "SCQ", answers: [{ text: "8", isCorrect: true }, { text: "53", isCorrect: false }, { text: "Error", isCorrect: false }] },
      { title: "Which of the following is the correct way to declare a pointer in C?", type: "MCQ", answers: [{ text: "int *ptr;", isCorrect: true }, { text: "*int ptr;", isCorrect: false }, { text: "int* ptr;", isCorrect: true }, { text: "ptr int*;", isCorrect: false }] },
    ]
  },
  JavaScript: {
    name: "JavaScript Programming",
    questions: [
      { title: "JavaScript is dynamically typed", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What keyword declares a variable with block scope?", type: "SCQ", answers: [{ text: "let", isCorrect: true }, { text: "var", isCorrect: false }, { text: "const", isCorrect: false }] },
    ]
  },
  Python: {
    name: "Python Programming",
    questions: [
      { title: "Python is an interpreted language", type: "SCQ", answers: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { title: "What keyword is used to create a function?", type: "SCQ", answers: [{ text: "def", isCorrect: true }, { text: "func", isCorrect: false }, { text: "function", isCorrect: false }] },
    ]
  }
};

const seedGroupsDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("🗑️  Clearing existing data...");
    await client.query("DELETE FROM user_answers");
    await client.query("DELETE FROM session_questions");
    await client.query("DELETE FROM quiz_sessions");
    await client.query("DELETE FROM answers");
    await client.query("DELETE FROM questions");
    await client.query("DELETE FROM categories");
    await client.query("DELETE FROM groups");

    console.log("📚 Creating groups...");
    const programmingGroup = await client.query(
      "INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING id",
      ["Programming Languages", "Questions about various programming languages"]
    );
    const programmingGroupId = programmingGroup.rows[0].id;
    console.log(`✅ Created group: Programming Languages (ID: ${programmingGroupId})`);

    let totalQuestions = 0;
    let totalCategories = 0;

    console.log("\n📑 Creating categories and questions...");
    for (const [langKey, langData] of Object.entries(programmingLanguages)) {
      console.log(`  ➕ Category: ${langData.name}`);

      const categoryResult = await client.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        [langData.name]
      );
      const categoryId = categoryResult.rows[0].id;
      totalCategories++;

      for (const question of langData.questions) {
        const questionResult = await client.query(
          "INSERT INTO questions (title, type, category_id, group_id) VALUES ($1, $2, $3, $4) RETURNING id",
          [question.title, question.type, categoryId, programmingGroupId]
        );
        const questionId = questionResult.rows[0].id;

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

    console.log("\n🎉 Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   Groups: 1`);
    console.log(`   Categories: ${totalCategories}`);
    console.log(`   Questions: ${totalQuestions}\n`);

    process.exit(0);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    client.release();
  }
};

seedGroupsDatabase();
