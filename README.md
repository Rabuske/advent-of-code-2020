
## Description

[Advent of Code 2020](https://adventofcode.com/2020) 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Accessing the results

When running locally, access it via http://localhost:3000/day/{dayNumber}. For example

* Day 01: http://localhost:3000/day/1
* Day 02: http://localhost:3000/day/2
* Day 25: http://localhost:3000/day/25


## Things that can definitely be improved:

After solving a puzzle, I go through the (subreddit)[https://www.reddit.com/r/adventofcode/] to check how other developers approached the problem. If I find things that can be used as a learning opportunity, I list them here:

[] Day 18 - consider implementing the [Shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
[] Day 18 - consider properly implement an AST
[] Day 18 - consider do something weird with eval()
[] Day 19 - challenge: implement my own CFG parser/evaluator instead of using the first one I found in npm
[] Day 19 - challenge: use Regex to solve the puzzle (part 01)