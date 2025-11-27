import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in .env file");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const query = sql.query.bind(sql);

async function seedPricingRates() {
  try {
    console.log("🌱 Starting pricing rates seed...");
    
    // Read the SQL file
    const sqlFile = readFileSync(
      join(process.cwd(), "migrations", "pricing_rates_with_data.sql"),
      "utf-8"
    );

    // Remove single-line comments
    const withoutComments = sqlFile.replace(/--.*$/gm, "");
    
    // Split by semicolons, but keep multi-line statements together
    const statements = withoutComments
      .split(";")
      .map((s) => s.trim().replace(/\s+/g, " ")) // Normalize whitespace
      .filter((s) => s.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute...`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          // Use query() for raw SQL strings
          await query(statement);
          successCount++;
          console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
        } catch (error: any) {
          // Ignore "already exists" errors for table/index creation and ON CONFLICT
          if (
            error?.message?.includes("already exists") ||
            error?.message?.includes("duplicate key") ||
            error?.message?.includes("ON CONFLICT") ||
            error?.code === "42P07" || // PostgreSQL: relation already exists
            error?.code === "23505"    // PostgreSQL: unique violation
          ) {
            skipCount++;
            console.log(`ℹ️  Statement ${i + 1} skipped (already exists or conflict handled)`);
          } else {
            errorCount++;
            console.error(`❌ Error in statement ${i + 1}:`, error?.message);
            console.error(`   Statement preview: ${statement.substring(0, 100)}...`);
            // Don't throw, continue with other statements
          }
        }
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ℹ️  Skipped: ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log("\n✅ Pricing rates seeded successfully!");
      console.log("📊 All categories should now have pricing rates in the database.");
      console.log("\n🎉 You can now test the API endpoints:");
      console.log("   - /api/rates/ECONOMY");
      console.log("   - /api/rates/BUSINESS_SEDAN");
      console.log("   - /api/rates/ECONOMY_VAN");
      console.log("   - /api/rates/BUSINESS_VAN");
      console.log("   - /api/rates/MINIBUS_12");
      console.log("   - /api/rates/MINIBUS_16");
    } else {
      console.log(`\n⚠️  Completed with ${errorCount} error(s). Please review the errors above.`);
    }
  } catch (error) {
    console.error("❌ Error seeding pricing rates:", error);
    process.exit(1);
  }
}

seedPricingRates();

