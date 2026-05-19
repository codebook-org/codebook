// mock DB
// TODO: remove once actual DB is implemented

export const problems = [
  { id: 1, title: "N-Queens", description: "..." },
  { id: 2, title: "Two Sum", description: "..." },
];

export const submissions = [
  { id: 1, problemId: 1, status: "Accepted", sourceCode: "..." },
  { id: 2, problemID: 1, status: "Wrong Answer", sourceCode: "..." },
];

// I am aware it's *incredibly* unsafe to store passwords as plaintext.
// But for now, our mock data guys can be miserable and get hacked, I couldn't care less.

export const fakeUsers = [
  {
    userId: 1,
    email: "email123@gmail.com",
    username: "email123",
    passwordHash: "password123",
  },
  {
    userId: 2,
    email: "bobjoe@gmail.com",
    username: "bobjoe",
    displayName: "evil bob joe",
    passwordHash: "12345",
  },
  {
    userId: 3,
    email: "hitman@gmail.com",
    username: "hitman",
    passwordHash: "hitmen",
  },
];
