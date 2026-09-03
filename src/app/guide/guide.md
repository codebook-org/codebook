# introduction

welcome to codebook. whether you're here to prepare for upcoming technical interviews, test your problem solving limits, or design and share your own challenges, this guide will walk you through everything codebook has to offer. dive into the sections below to get started, or use the sidebar to jump to a section.

## accounts

to access codebook’s features, you need an account.

### register

creating an account takes less than a minute, and its free! click the sign up in the top right corner and hit register now. you can use your email address or use your google account. once verified, your profile will track your solved problems, problem creation history, and community ratings and contributions automatically.

### log In

if you already have a codebook account, click the sign up in the top right corner. log in is automatically selected, so simply choose the option you originally registered with, and jump straight back into coding.

## solve problems

sharpen your algorithmic thinking or practice language-specific syntax across a vast expanse of user curated challenges.

### description

every challenge includes a problem statement outlining the objective, input/output formats, and strict constraints. walk through provided test cases to ensure your logic accounts for scale and complexity.

### code editor

write, test, and submit your solutions directly in browser, with multiple supported languages. start with provided starter code, or face it blank.

### submitting solutions

once you’re confident in your implementation, click the submit button below the code editor. this triggers our automated judge thanks to the Piston API, which compiles and tests your solution against i/o inputs to evaluate correctness.

### view accuracy

after your submission is evaluated, the test result tab displays your verdict. you’ll see whether your code passed or ran into errors (such as a wrong answer or compilation error), as well as overall accuracy to help you in future attempts.

## create problems

more flavour text claiming that donating 1000 dollars to each codebook member will extend life expectancy..

### title

give your problem a concise and descriptive title in the top input field. a clear name helps other coders quickly identify the problem’s theme or focus.

### writing descriptions

write your problem using markdown and LaTeX in the description panel.

- **preview** — toggle between the write and preview tabs to verify how your formatting, code blocks, and examples render before you submit.
- **specifications** — clearly state your input types, output requirements, and edge case constraints.
- **math and LaTeX** — format mathematical notation and variable constraints directly using inline or block LaTeX syntax.
- **examples** — include walkthrough examples with labelled inputs, outputs, and brief explanations showing how the logic executes.

### starter Code

provide boilerplate implementations across our supported languages (C++, Python, Java).

- **standard i/o** — codebook uses standard input/output (stdin and stdout) to validate test runs
- **boilerplate patterns** — consider managing i/o handling in the background (like reading `std::cin` inside main) while leaving an empty function with helpful comments directing users where to write their logics.

here's an example of c++ boilerplate code, where the backend handles the inputs and outputs.

```
#include <iostream>

// User-facing function where they write their logic:
int solve(int n) {
	// Write code here.
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

### test Cases

build the test suite used by the judge to evaluate programmer submissions.

- **input & output** — supply the input and output expected in the text boxes given.
- **visibility** — toggle test case privacy using the lock icon to designate cases as public samples or hidden cases.
- **management** — click the + button to append additional cases or the x to remove a case from the suite.

## profiles

your profile serves as your personal hub and public portfolio on codebook. customize your profile, monitor your progress, and showcase the challenges you’ve authored the community.

### displayed information

not only can you curate and contribute to the community through problems, but curate a profile you want to show to the people.

- **avatar & handle** — display your username and customized avatar across the platform. use a display name if you’d like an alternative name from your handle.
- **about you** — share a brief bio introducing yourself, your tech stack, or your coding interests.
- **editing your profile** — click the icon the navbar to find the settings. update your bio, display name, or handle. preview it in the settings page to make sure it looks right.

### problems solved

track your problems solved! this tab lists every challenge you have successfully completed, giving you a quick record of your past solution and practice history.

### published problems

manage and show off the challenges you’ve created. this tab displays all the problems you’ve authored and published to codebook, allowing other users to explore, solve, and rate your contributions.


