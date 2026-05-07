require("dotenv").config({ path: "../.env" });
const pool = require("../config/db");

const seedCompleteDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("\n🗑️  Clearing data (keeping admins)...");
    await client.query("DELETE FROM user_answers");
    await client.query("DELETE FROM session_questions");
    await client.query("DELETE FROM quiz_sessions");
    await client.query("DELETE FROM answers");
    await client.query("DELETE FROM questions");
    await client.query("DELETE FROM categories");
    await client.query("DELETE FROM groups");

    // ==================== PROGRAMMING LANGUAGES GROUP ====================
    console.log("\n📚 Creating 'Programming Languages' group...");
    const progGroup = await client.query(
      "INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING id",
      ["Programming Languages", "لغات البرمجة المختلفة"]
    );
    const progGroupId = progGroup.rows[0].id;

    const progLanguages = ["C", "C++", "Java", "JavaScript", "Python", "PHP"];
    let totalQuestions = 0;

    console.log("📑 Creating categories and questions...");
    for (const lang of progLanguages) {
      const catResult = await client.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        [lang]
      );
      const catId = catResult.rows[0].id;
      console.log(`  ✅ ${lang}`);

      // 10 questions per category
      for (let q = 1; q <= 10; q++) {
        const qResult = await client.query(
          "INSERT INTO questions (title, type, category_id, group_id) VALUES ($1, $2, $3, $4) RETURNING id",
          [
            `${lang} Question ${q}`,
            q % 2 === 0 ? "MCQ" : "SCQ",
            catId,
            progGroupId
          ]
        );
        const qId = qResult.rows[0].id;

        // Add 3-4 answers per question
        const answerCount = q % 2 === 0 ? 4 : 3;
        for (let a = 1; a <= answerCount; a++) {
          await client.query(
            "INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3)",
            [
              qId,
              `${lang} Question ${q} Answer ${a}`,
              a === 1 // First answer is correct
            ]
          );
        }
        totalQuestions++;
      }
    }

    // ==================== CULTURE GROUP ====================
    console.log("\n📚 Creating 'ثقافة عامة' group...");
    const cultureGroup = await client.query(
      "INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING id",
      ["ثقافة عامة", "أسئلة ثقافية عامة متنوعة"]
    );
    const cultureGroupId = cultureGroup.rows[0].id;

    const cultureCategories = ["رياضة", "تاريخ", "جغرافيا", "علوم", "فنون"];

    for (const cat of cultureCategories) {
      const catResult = await client.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        [cat]
      );
      const catId = catResult.rows[0].id;
      console.log(`  ✅ ${cat}`);

      // 10 questions per category
      for (let q = 1; q <= 10; q++) {
        const qResult = await client.query(
          "INSERT INTO questions (title, type, category_id, group_id) VALUES ($1, $2, $3, $4) RETURNING id",
          [
            `${cat} سؤال ${q}`,
            q % 2 === 0 ? "MCQ" : "SCQ",
            catId,
            cultureGroupId
          ]
        );
        const qId = qResult.rows[0].id;

        // Add 3-4 answers per question
        const answerCount = q % 2 === 0 ? 4 : 3;
        for (let a = 1; a <= answerCount; a++) {
          await client.query(
            "INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3)",
            [
              qId,
              `${cat} سؤال ${q} إجابة ${a}`,
              a === 1 // First answer is correct
            ]
          );
        }
        totalQuestions++;
      }
    }

    await client.query("COMMIT");

    console.log("\n🎉 Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   Groups: 2`);
    console.log(`   Categories: 11 (6 Programming + 5 Culture)`);
    console.log(`   Questions: ${totalQuestions}`);
    console.log(`   Answers: ~${totalQuestions * 3.5}\n`);

    process.exit(0);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error seeding database:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
  }
};

seedCompleteDatabase();
