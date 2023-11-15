const express = require("express");

const {
  pool,
  createUserTable,
  createPostTable,
  createFollowTable,
} = require("./db");

const app = express();

app.use(express.json());

// create Teables
// createUserTable();
// createPostTable();
// createFollowTable();

// USERS
app.post("/api/v1/users/register", async (req, res) => {
  const client = await pool.connect();
  const { username, role } = req.body;
  const text = "INSERT INTO users(username,role) VALUES($1,$2) RETURNING *";
  const values = [username, role ? role : "user"];
  try {
    const result = await client.query(text, values);
    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "user created successfully!",
        data: result.rows[0],
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occured!",
      error,
    });
  } finally {
    client.release();
  }
});

app.get("/api/v1/users/", async (req, res) => {
  const query = `SELECT * FROM users;`;
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return res.status(200).json({
      message: "success",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occured!",
      error,
    });
  } finally {
    client.release();
  }
});

app.get("/api/v1/users/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const query = `SELECT * FROM users WHERE user_id='${user_id}';`;
  const client = await pool.connect();
  try {
    const result = await client.query(query, [user_id]);
    return res.status(200).json({
      message: "success",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occured!",
      error,
    });
  } finally {
    client.release();
  }
});
app.put("/api/v1/users/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { username, role } = req.body;
  const client = await pool.connect();
  try {
    const userExists = await client.query(
      `SELECT * FROM users WHERE user_id='${user_id}';`
    );

    if (userExists) {
      const { role: rol, username: name } = userExists.rows[0];
      const query = `UPDATE users SET ${
        username ? `username='${username}',` : `username='${name}',`
      } ${role ? `role='${role}'` : `role='${rol}'`} WHERE user_id=$1; `;
      const values = [id];
      const result = await client.query(query, values);
      return res.status(200).json({
        message: "user info updated successfully!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occured!",
      error,
    });
  } finally {
    client.release();
  }
});
app.delete("/api/v1/users/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const query = `DELETE FROM users WHERE user_id='${user_id}';`;
  const client = await pool.connect();
  try {
    await client.query(query);
    return res.status(200).json({
      message: "The user has been deleted!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occured!",
      error,
    });
  } finally {
    client.release();
  }
});

//FOLLOW

app.post("/api/v1/follows/create", async (req, res) => {
  const client = await pool.connect();
  const { followed_user_id, following_user_id } = req.body;
  const query =
    "INSERT INTO follows(followed_user_id,following_user_id) VALUES($1,$2) RETURNING *;";
  const values = [followed_user_id, following_user_id];
  try {
    const result = await client.query(query, values);
    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "created successfully!",
        data: result.rows[0],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

app.get("/api/v1/follows/:user_id/", async (req, res) => {
  const { user_id } = req.params;
  const query = `SELECT * FROM follows WHERE followed_user_id='${user_id}';`;
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return res.status(200).json({
      message: "success",
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

app.delete(
  "/api/v1/follows/:followed_user_id/:following_user_id",
  async (req, res) => {
    const { followed_user_id, following_user_id } = req.params;
    const query = `DELETE FROM follows  WHERE(followed_user_id='${followed_user_id}' AND following_user_id='${following_user_id}');`;
    const client = await pool.connect();
    try {
      await client.query(query);
      return res.status(200).json({
        message: "deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      client.release();
    }
  }
);

// POSTS

app.post("/api/v1/posts/:user_id/create", async (req, res) => {
  const client = await pool.connect();
  const { user_id } = req.params;
  const { title, body, status } = req.body;
  const query =
    "INSERT INTO posts(title,body,status, user_id) VALUES($1,$2,$3,$4) RETURNING *";
  const values = [title, body, status, user_id];
  try {
    const result = await client.query(query, values);
    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "created successfully!",
        data: result.rows[0],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

app.get("/api/v1/posts/:user_id/", async (req, res) => {
  const { user_id } = req.params;
  const query = `SELECT * FROM posts WHERE user_id=$1;`;
  const client = await pool.connect();
  try {
    const result = await client.query(query, [user_id]);
    return res.status(200).json({
      message: "success",
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

app.get("/api/v1/posts/:user_id/:post_id", async (req, res) => {
  const { user_id, post_id } = req.params;
  const query = `SELECT * FROM posts WHERE(user_id='${user_id}' AND post_id='${post_id}');`;
  const client = await pool.connect();
  try {
    const result = await client.query(query);

    return res.status(200).json({
      message: "success",
      data: result.rows[0] || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

app.patch("/api/v1/posts/:user_id/:post_id", async (req, res) => {
  const { user_id, post_id } = req.params;
  const { title, body, status } = req.body;

  const client = await pool.connect();
  try {
    const existingpost = await client.query(
      `SELECT * FROM posts WHERE(user_id='${user_id}' AND post_id='${post_id}');`
    );
    if (existingpost) {
      const { title: t, body: b, status: st } = existingpost.rows[0];
      const query = `UPDATE posts SET 
      ${title ? `title='${title}',` : `title='${t}',`} 
      ${body ? `body='${body}',` : `body='${b}',`}
       ${status ? `status='${status}'` : `status='${st}'`} 
        WHERE(user_id='${user_id}' AND post_id='${post_id}'); `;

      const response = await client.query(query);

      return res.status(200).json({
        message: "updated",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

app.delete("/api/v1/posts/:user_id/:post_id", async (req, res) => {
  const { user_id, post_id } = req.params;
  const query = `DELETE FROM posts WHERE(user_id='${user_id}' AND post_id='${post_id}');;`;
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return res.status(200).json({
      message: "deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

app.listen(5000, () => console.log("server is running on port:5000"));
