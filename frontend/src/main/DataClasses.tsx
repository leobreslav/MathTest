class ProblemHead{
    id: number = 0;
    problem: string = "";
}

class ProblemPoint{
    id: number = 0;
    num_in_problem: number = 0;
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

class TestTemplate{
    id: number = 0;
    name: string = "";
    prototypes: ProblemPrototype[] = [];
    items: TestItem[] = [];
}

class TestItem{
    id: number = 0;
    student_full: User = new User(); 
}

class LoginStatus{
    isLogin: boolean = false;
    token: string = "";
    username: string = "";
}

class User {
    username: string = "";
    email: string = "";
    id: number = 0;
    first_name: string = "";
    last_name: string = "";
}

class ProblemPointItem {
    id: number = 0;
    answer: string = "";
    score: number = 0;
    comment: string = "";
    num_in_problem: number = 0;
}

class ProblemItem {
    id: number = 0;
    index: number = 0;
    problem_head: Problem= new Problem();
    points: ProblemPointItem[] = [];
}

class Test {
    id: number = 0;
    name: string = "";
    problem_items: ProblemItem[] = [];
}

const MathJaxConfig = {
    extensions: ["tex2jax.js"],
    TeX: {
        extensions: [
            "autoload-all.js"
        ]
    },
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
        inlineMath: [ ['$','$'], ["\\(","\\)"] ],
        displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        processEscapes: true
    }
}

export{
    ProblemHead,
    ProblemPoint,
    Problem,
    ProblemPrototype,
    TestTemplate,
    LoginStatus,
    User,
    TestItem,
    ProblemPointItem,
    ProblemItem,
    Test,
    MathJaxConfig
};