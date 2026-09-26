## ✨ About

codebook was created by a group of friends from the University of Washington.

It's a platform for hosting custom LeetCode-style programming problems,
and is designed to make sharing coding challenges convenient and fun.
If you enjoy DSA, competitive programming, or just creating clever challenges, you'll feel right at home here!

### Features

- **Create problems**: Use the problem editor to craft custom coding problems.
- **Grow your profile**: Your profile serves as your very own repository of custom programming challenges.
- **Challenge your friends**: It's as easy as sending a link!
- **In-browser code editing**: Users solve problems directly in the browser using C++, Python, and Java.
- **Sandboxed execution**: Secure and efficient code execution powered by [Piston](https://github.com/engineer-man/Piston).

You can learn more about codebook's features below.

## 🚀 Getting started

An account is required to fully access codebook's features.

Once you are signed in, you will be able to create programming problems using the problem editor. These problems are saved to your profile, which serves
as your very own repository of custom-made challenges.

Solving problems on codebook does _not_ require you to be signed in; however, you will not be able to cast votes or record your solutions unless you are signed in.

### Creating an account

codebook currently supports Google sign-in only.
Click the **Sign in** button in the upper-right corner of this page to navigate to the authentication screen.
Then, select **Sign in with Google** and enter your credentials when prompted to complete the process.

### A quick tour

Navigate codebook using the navbar at the top of the page. Below is a quick overview of all of codebook's pages:

- **Home**: codebook's landing page. Check back here for news and release notes.
- **Guide**: A comprehensive guide of codebook's features. If you're unsure about something, check here first.
- **Profile**: This is where your coding problems live. Access it via the user navigation menu located on the right end of the navbar.
- **Solve**: When you open a problem, you will see the problem solving interface, which should look familiar. More on that in the next section.
- **Publish**: codebook's problem editor. It can be accessed via the user navigation menu.

### So, where are all the problems?

A new user interested in _solving_ programming problems may be confused by codebook's lack of a searchable library of problems.
This is intentional. codebook is built first and foremost as a tool for users who are interested in _creating_ programming problems.

If you're here to grind DSA skills for an upcoming technical interview, then you're in the wrong place. [LeetCode](https://leetcode.com) is a much better-suited tool for that!

## ✏️ Solving problems

This section outlines the features of codebook's problem solving interface.
It should look very familiar if you've used platforms such as LeetCode, HackerRank, or CodeSignal.

### Description

Every problem includes a problem statement. Problem authors will generally provide details such as problem objectives, input/output specifications, and helpful examples.
It is up to the problem author to provide users with a high quality problem description.

At the top of the description pane, you can view the problem's current like count and the total accepted submissions. If you are signed in, you may cast your own vote here and,
upon solving the problem for the first time, your solution will be recorded.

### Code editor

The code editor is where users write their solutions. When you open a problem for the first time, the code editor pane may already be populated with some starter code.
This starter code is provided by the problem author. If you get stuck on a problem, and have strayed too far from the starter code, you can click the **Reset** button
in the top right corner of the code editor pane to reset the current language's code back to the default starter code provided by the problem author.

Currently, codebook supports three programming languages &mdash; C++, Python, and Java. The current language can be toggled using the dropdown menu in the upper left corner of the code editor pane.

In the top right section of the code editor pane, you may also toggle between keybinding modes. Currently, codebook only supports Standard mode and Vim mode, but Emacs style keybindings are coming soon!

### Test result

To submit a solution to codebook's server for grading, click the **Submit** button at the bottom of the code editor pane.
After your submission is evaluated, the test result pane displays your verdict.

There are four possible test result verdicts:

- **Accepted**: Your submission passed all of the provided test cases.
- **Wrong answer**: Your submission failed on at least one of the provided test cases.
- **Compile error**: The code execution engine was unable to compile your submission due to a compilation error.
- **Runtime error**: The code execution engine encountered a runtime error when running your compiled submission.

In the case of an error, `stderr` will be displayed. Otherwise, the pane will be populated by each of the test cases that the problem author has provided.
You can click on an individual test case to view its details. Note that some test cases may be hidden by the problem
author. The details of hidden test cases cannot be viewed.

## 📚 Problem editor

codebook's problem editor allows users to author their own programming problems. This section covers the problem editor's features as well as some best practices for creating programming problems.

### Writing a description

Every programming problem needs a description. A good description clearly outlines the problem's objectives to the solver.

Generally, an effective description includes:

- A clear task or objective.
- An explanation of all problem assumptions.
- Detailed input and output specifications.
- Specific input constraints.
- Concrete examples of inputs and expected outputs with accompanying explanations.

You can use Markdown and LaTeX to format your problem's description. Before publishing, make sure to check the **Preview** tab to see how the rendered content looks and make adjustments as needed.

### Starter code

Providing starter code is not required. If you choose to omit starter code from your problem, make sure to instruct solvers (via the problem description) to read inputs from `stdin` and write outputs to `stdout`, as this is how codebook's code execution engine evaluates solutions.

Leaving the starter code blank and tasking the user with writing the _entire program_ is a style most commonly used in competitive programming. If you want your programming problem to feel more like LeetCode &mdash; where solvers are asked only to implement a single _function_ &mdash; you can handle standard I/O for them in your starter code.

Here is an example of some C++ starter code that demonstrates this pattern:

```
#include <iostream>

// User-facing function:
int solve(int n) {
    // Solver writes their implementation here!
    return 0;
}

// Main manages standard I/O:
int main() {
    int n;
    std::cin >> n;
    std::cout << solve(n);
    return 0;
}
```

### Test cases

Test cases are used by codebook's judge to evaluate the correctness of a code submission. A good set of test cases generally covers the full range of a problem's constraints
as well as edge cases.

To add a test case, use the square **Plus** button inside of the **Test Cases** pane. Once a test case is added, you can edit its **Input** and **Expected Output**, which are used to evaluate
the correctness of a code submission. The **Input** is passed to the code submission via `stdin` and the output of the program is written to `stdout`.
This output is then compared against the provided **Expected Output** to evaluate the correctness of the submission.

You can toggle whether a test case is **Hidden** using the **Lock** button. A hidden test case's details cannot be viewed by the solver. It is generally a good idea to hide
trickier test cases from the solver.

### Publishing and sharing your problem

Once you're ready, choose a fitting title for your problem and click the **Publish** button. When a problem is published, it cannot be edited, only deleted, so make
sure to triple-check for any typos or mistakes.

Once published, your newly minted problem will live on your profile under the **My problems** tab. Users viewing your profile will be able to see the new problem and attempt
to solve it. You can also copy the link to the problem and send it directly to your friends!

## 🐞 Reporting bugs

If you encounter a bug, please open an issue over on [GitHub](https://github.com/codebook-org/codebook).
