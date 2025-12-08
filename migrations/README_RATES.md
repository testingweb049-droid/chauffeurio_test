# Pricing Rates Migration Guide

## Option 1: Using psql (PostgreSQL Command Line)

```bash
# Connect to your database and run the migration
psql -U your_username -d your_database_name -f migrations/pricing_rates_with_data.sql

# Or if you have DATABASE_URL in your .env file:
psql $DATABASE_URL -f migrations/pricing_rates_with_data.sql
```

## Option 2: Using pgAdmin

1. Open pgAdmin
2. Connect to your database
3. Right-click on your database → Query Tool
4. Open the file `migrations/pricing_rates_with_data.sql`
5. Copy and paste the entire content
6. Click Execute (F5)

## Option 3: Using Drizzle Kit (Recommended)

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate
```

Then manually insert the data using Option 1 or 2.

## Option 4: Direct SQL Execution

If you're using a database client (like DBeaver, TablePlus, etc.):

1. Connect to your database
2. Open a SQL editor
3. Copy the contents of `migrations/pricing_rates_with_data.sql`
4. Execute the script

## Verify the Data

After running the migration, verify the data was inserted:

```sql
SELECT category, pricing_structure, is_active 
FROM pricing_rates 
ORDER BY category;
```

## Default Pricing Structure

All categories follow this pattern:
- **0-3 km**: Fixed price
- **3-5 km**: Fixed price  
- **5-10 km**: Per kilometer pricing
- **10-15 km**: Per kilometer pricing (increment of 2€ from previous)
- **15-20 km**: Per kilometer pricing (increment of 2€)
- And so on up to 100 km

Each category has different base prices, but follows the same structure.

