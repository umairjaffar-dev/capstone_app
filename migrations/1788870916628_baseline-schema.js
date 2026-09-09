/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // 1. users table
  pgm.createTable("users", {
    id: "id",
    name: { type: "varchar(100)", notNull: true },
    email: { type: "varchar(150)", notNull: true, unique: true },
    age: { type: "smallint" },
    is_active: { type: "boolean", default: true },
    balance: { type: "numeric(10,2)", default: 0.0 },
    bio: { type: "text" },
    preferences: { type: "jsonb" },
    created_at: { type: "timestamp", default: pgm.func("now()") },
  });

  // 2. posts table (users ko reference karti hai)
  pgm.createTable("posts", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
    },
    title: { type: "varchar(200)", notNull: true },
    content: { type: "text" },
    created_at: { type: "timestamp", default: pgm.func("now()") },
  });

  // 3. tags table (koi dependency nahi)
  pgm.createTable("tags", {
    id: "id",
    name: { type: "varchar(50)", notNull: true, unique: true },
  });

  // 4. post_tags junction table (posts aur tags dono ko reference karti hai)
  pgm.createTable(
    "post_tags",
    {
      post_id: {
        type: "integer",
        notNull: true,
        references: "posts",
      },
      tag_id: {
        type: "integer",
        notNull: true,
        references: "tags",
      },
    },
    {
      constraints: {
        primaryKey: ["post_id", "tag_id"],
      },
    },
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Reverse order mein drop karo (dependencies ki wajah se)
  pgm.dropTable("post_tags");
  pgm.dropTable("tags");
  pgm.dropTable("posts");
  pgm.dropTable("users");
};
