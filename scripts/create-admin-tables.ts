import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

async function createAdminTables() {
  try {
    console.log("Creating admin tables...");

    // Create admins table
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    console.log("✅ Created admins table");

    // Create index on email
    await sql`
      CREATE INDEX IF NOT EXISTS admins_email_idx ON admins(email);
    `;
    console.log("✅ Created admins_email_idx index");

    // Create admin_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    console.log("✅ Created admin_sessions table");

    // Create indexes on admin_sessions
    await sql`
      CREATE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions(token);
    `;
    console.log("✅ Created admin_sessions_token_idx index");

    await sql`
      CREATE INDEX IF NOT EXISTS admin_sessions_admin_id_idx ON admin_sessions(admin_id);
    `;
    console.log("✅ Created admin_sessions_admin_id_idx index");

    // Create admin_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        resource VARCHAR(100),
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    console.log("✅ Created admin_logs table");

    // Create indexes on admin_logs
    await sql`
      CREATE INDEX IF NOT EXISTS admin_logs_admin_id_idx ON admin_logs(admin_id);
    `;
    console.log("✅ Created admin_logs_admin_id_idx index");

    await sql`
      CREATE INDEX IF NOT EXISTS admin_logs_created_at_idx ON admin_logs(created_at);
    `;
    console.log("✅ Created admin_logs_created_at_idx index");

    console.log("\n🎉 All admin tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating admin tables:", error);
    process.exit(1);
  }
}

createAdminTables();

