const db = require('./config/db');

/**
 * Seed database with sample groups and categories
 * This script clears existing data and populates fresh sample data
 */

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Delete all existing data (in order to avoid foreign key violations)
    console.log('🗑️  Clearing existing data...');
    await db.query('DELETE FROM answers');
    await db.query('DELETE FROM questions');
    await db.query('DELETE FROM quiz_sessions');
    await db.query('DELETE FROM categories');
    await db.query('DELETE FROM groups');
    await db.query('ALTER SEQUENCE groups_id_seq RESTART WITH 1');
    await db.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    await db.query('ALTER SEQUENCE questions_id_seq RESTART WITH 1');
    console.log('✅ Data cleared.\n');

    // Create Groups
    console.log('📚 Creating groups...');
    const groupsData = [
      {
        name: 'لغات البرمجة',
        description: 'أسئلة عن لغات البرمجة المختلفة'
      },
      {
        name: 'ثقافة عامة',
        description: 'أسئلة عامة متنوعة'
      }
    ];

    const groupResult = await db.query(
      'INSERT INTO groups (name, description) VALUES ($1, $2), ($3, $4) RETURNING id, name',
      [groupsData[0].name, groupsData[0].description, groupsData[1].name, groupsData[1].description]
    );

    const groups = groupResult.rows;
    const groupIds = {
      programming: groups[0].id,
      culture: groups[1].id
    };

    console.log(`✅ Created ${groups.length} groups`);
    console.log(`   - لغات البرمجة (ID: ${groupIds.programming})`);
    console.log(`   - ثقافة عامة (ID: ${groupIds.culture})\n`);

    // Create Categories
    console.log('📑 Creating categories...');
    const categoriesData = [
      // Programming categories
      { name: 'JavaScript', group: groupIds.programming },
      { name: 'Python', group: groupIds.programming },
      { name: 'Java', group: groupIds.programming },

      // Culture categories
      { name: 'دول', group: groupIds.culture },
      { name: 'طعام', group: groupIds.culture },
      { name: 'تاريخ', group: groupIds.culture }
    ];

    let categoryIds = {};
    let categoryIndex = 1;

    for (const cat of categoriesData) {
      const result = await db.query(
        'INSERT INTO categories (name) VALUES ($1) RETURNING id, name',
        [cat.name]
      );
      categoryIds[cat.name] = result.rows[0].id;
      console.log(`✅ Created category: ${cat.name} (ID: ${result.rows[0].id})`);
    }
    console.log();

    // Create Sample Questions
    console.log('❓ Creating sample questions...');

    const sampleQuestions = [
      // JavaScript Questions
      {
        title: 'ما الفرق بين var و let؟',
        type: 'MCQ',
        categoryId: categoryIds['JavaScript'],
        groupId: groupIds.programming,
        answers: [
          { text: 'var عام، let محدود النطاق', isCorrect: true },
          { text: 'لا يوجد فرق', isCorrect: false },
          { text: 'let أقدم من var', isCorrect: false }
        ]
      },
      {
        title: 'كيف تنشئ arrow function في JavaScript؟',
        type: 'SCQ',
        categoryId: categoryIds['JavaScript'],
        groupId: groupIds.programming,
        answers: [
          { text: 'const func = () => {}', isCorrect: true },
          { text: 'def func () {}', isCorrect: false },
          { text: 'function => func () {}', isCorrect: false }
        ]
      },
      // Python Questions
      {
        title: 'ما هو الفرق بين list و tuple في Python؟',
        type: 'MCQ',
        categoryId: categoryIds['Python'],
        groupId: groupIds.programming,
        answers: [
          { text: 'list قابل للتعديل، tuple ثابت', isCorrect: true },
          { text: 'tuple أسرع من list', isCorrect: false },
          { text: 'لا يوجد فرق', isCorrect: false }
        ]
      },
      {
        title: 'كيف تعرّف دالة في Python؟',
        type: 'SCQ',
        categoryId: categoryIds['Python'],
        groupId: groupIds.programming,
        answers: [
          { text: 'def function_name():', isCorrect: true },
          { text: 'function function_name() {}', isCorrect: false },
          { text: 'func function_name():', isCorrect: false }
        ]
      },
      // Java Questions
      {
        title: 'ما هي الفئة الأساسية في Java؟',
        type: 'SCQ',
        categoryId: categoryIds['Java'],
        groupId: groupIds.programming,
        answers: [
          { text: 'Object', isCorrect: true },
          { text: 'Class', isCorrect: false },
          { text: 'Main', isCorrect: false }
        ]
      },
      {
        title: 'كيف تنشئ متغير في Java؟',
        type: 'MCQ',
        categoryId: categoryIds['Java'],
        groupId: groupIds.programming,
        answers: [
          { text: 'int x = 5;', isCorrect: true },
          { text: 'x = 5;', isCorrect: false },
          { text: 'var x = 5;', isCorrect: false }
        ]
      },
      // Countries (Culture)
      {
        title: 'ما هي عاصمة فرنسا؟',
        type: 'SCQ',
        categoryId: categoryIds['دول'],
        groupId: groupIds.culture,
        answers: [
          { text: 'باريس', isCorrect: true },
          { text: 'ليون', isCorrect: false },
          { text: 'مارسيليا', isCorrect: false }
        ]
      },
      {
        title: 'كم عدد دول الاتحاد الأوروبي؟',
        type: 'SCQ',
        categoryId: categoryIds['دول'],
        groupId: groupIds.culture,
        answers: [
          { text: '27', isCorrect: true },
          { text: '25', isCorrect: false },
          { text: '30', isCorrect: false }
        ]
      },
      // Food (Culture)
      {
        title: 'ما هي الدولة الأصلية للبيتزا؟',
        type: 'SCQ',
        categoryId: categoryIds['طعام'],
        groupId: groupIds.culture,
        answers: [
          { text: 'إيطاليا', isCorrect: true },
          { text: 'اليونان', isCorrect: false },
          { text: 'إسبانيا', isCorrect: false }
        ]
      },
      {
        title: 'ما هي أشهر حلويات فرنسية؟',
        type: 'MCQ',
        categoryId: categoryIds['طعام'],
        groupId: groupIds.culture,
        answers: [
          { text: 'الكرواسون', isCorrect: true },
          { text: 'المعمول', isCorrect: false },
          { text: 'البقلاوة', isCorrect: false }
        ]
      },
      // History (Culture)
      {
        title: 'في أي سنة سقطت الحضارة الرومانية؟',
        type: 'SCQ',
        categoryId: categoryIds['تاريخ'],
        groupId: groupIds.culture,
        answers: [
          { text: 'سنة 476', isCorrect: true },
          { text: 'سنة 333', isCorrect: false },
          { text: 'سنة 1000', isCorrect: false }
        ]
      },
      {
        title: 'متى بدأت الحرب العالمية الأولى؟',
        type: 'SCQ',
        categoryId: categoryIds['تاريخ'],
        groupId: groupIds.culture,
        answers: [
          { text: 'سنة 1914', isCorrect: true },
          { text: 'سنة 1912', isCorrect: false },
          { text: 'سنة 1918', isCorrect: false }
        ]
      }
    ];

    let questionCount = 0;
    for (const q of sampleQuestions) {
      const questionResult = await db.query(
        'INSERT INTO questions (title, type, category_id, group_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [q.title, q.type, q.categoryId, q.groupId]
      );

      const questionId = questionResult.rows[0].id;

      // Insert answers
      for (const answer of q.answers) {
        await db.query(
          'INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3)',
          [questionId, answer.text, answer.isCorrect]
        );
      }
      questionCount++;
      console.log(`✅ Created question: ${q.title}`);
    }

    console.log(`\n✅ Created ${questionCount} questions with answers\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Groups: 2`);
    console.log(`   Categories: 6`);
    console.log(`   Questions: ${questionCount}`);
    console.log(`   Answers: ${sampleQuestions.reduce((acc, q) => acc + q.answers.length, 0)}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase();
