
class ProblemHead{
    id: number = 0;
    problem: string = "";
}

class ProblemPoint{
    id: number = 0;
    num_in_problems: number = 0;
    answer: string = "";
}

class Problem{
    id: number = 0;
    problem: string = "";
    problempoint_set: ProblemPoint[] = [];
}

class ProblemPrototype{
    id: number = 0;
    name: string = "";
    example: Problem = new Problem;
}

export{
    ProblemHead,
    ProblemPoint,
    Problem,
    ProblemPrototype
};