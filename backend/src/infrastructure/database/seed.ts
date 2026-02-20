import { pool } from "./pool";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = "password123";

// Generate bcrypt hash for password
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

const seedData = async () => {
  try {
    console.log("Starting seed data...");

    // Hash password once for all users
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);

    // Admin user
    await pool.query(
      `INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ["00000000-0000-0000-0000-000000000001", "admin@example.com", "Admin User", passwordHash]
    );
    console.log("✓ Admin user created: admin@example.com");

    // Dummy users (10 users)
    const dummyUsers = [
      { id: "00000000-0000-0000-0000-000000000002", email: "john.doe@example.com", name: "John Doe", daysAgo: 10 },
      { id: "00000000-0000-0000-0000-000000000003", email: "jane.smith@example.com", name: "Jane Smith", daysAgo: 9 },
      { id: "00000000-0000-0000-0000-000000000004", email: "bob.johnson@example.com", name: "Bob Johnson", daysAgo: 8 },
      { id: "00000000-0000-0000-0000-000000000005", email: "alice.williams@example.com", name: "Alice Williams", daysAgo: 7 },
      { id: "00000000-0000-0000-0000-000000000006", email: "charlie.brown@example.com", name: "Charlie Brown", daysAgo: 6 },
      { id: "00000000-0000-0000-0000-000000000007", email: "diana.davis@example.com", name: "Diana Davis", daysAgo: 5 },
      { id: "00000000-0000-0000-0000-000000000008", email: "edward.miller@example.com", name: "Edward Miller", daysAgo: 4 },
      { id: "00000000-0000-0000-0000-000000000009", email: "fiona.wilson@example.com", name: "Fiona Wilson", daysAgo: 3 },
      { id: "00000000-0000-0000-0000-000000000010", email: "george.moore@example.com", name: "George Moore", daysAgo: 2 },
      { id: "00000000-0000-0000-0000-000000000011", email: "helen.taylor@example.com", name: "Helen Taylor", daysAgo: 1 },
    ];

    for (const user of dummyUsers) {
      await pool.query(
        `INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW() - INTERVAL '${user.daysAgo} days', NOW() - INTERVAL '${user.daysAgo} days')
         ON CONFLICT (email) DO NOTHING`,
        [user.id, user.email, user.name, passwordHash]
      );
      console.log(`✓ User created: ${user.email}`);
    }

    console.log("\n✅ Seed data completed successfully!");
    console.log(`\n📝 Login credentials:`);
    console.log(`   Email: admin@example.com`);
    console.log(`   Password: ${DEFAULT_PASSWORD}`);
    console.log(`\n   (All dummy users also use password: ${DEFAULT_PASSWORD})`);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedData();
