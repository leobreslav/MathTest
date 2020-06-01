
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

export{
    ProblemHead,
    ProblemPoint,
    Problem,
    ProblemPrototype,
    TestTemplate,
    LoginStatus,
    User,
    TestItem
};